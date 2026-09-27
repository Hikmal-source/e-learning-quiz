import { NextResponse } from "next/server";

import { getAdminSession } from "@/libs/auth/admin";
import {
  deleteLesson,
  getLessonById,
  updateLesson,
} from "@/libs/service/lessons.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const { id } = await context.params;

  try {
    const lesson = await getLessonById(id);

    if (!lesson) {
      return NextResponse.json(
        {
          message: "Lesson not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error(
      "GET_LESSON_API_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to get lesson.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const { id } = await context.params;

  try {
    const body = await request.json();

    const {
      title,
      content,
      order,
    } = body;

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        {
          message: "Title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !content ||
      typeof content !== "object" ||
      Array.isArray(content)
    ) {
      return NextResponse.json(
        {
          message: "Invalid lesson content.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof order !== "number" ||
      !Number.isInteger(order) ||
      order < 1
    ) {
      return NextResponse.json(
        {
          message:
            "Order must be a positive integer.",
        },
        {
          status: 400,
        }
      );
    }

    const lesson = await getLessonById(id);

    if (!lesson) {
      return NextResponse.json(
        {
          message: "Lesson not found.",
        },
        {
          status: 404,
        }
      );
    }

    const duplicateLesson =
      await import("@/libs/prisma").then(
        async ({ prisma }) =>
          prisma.lesson.findFirst({
            where: {
              materialId: lesson.materialId,
              order,
              NOT: {
                id,
              },
            },
          })
      );

    if (duplicateLesson) {
      return NextResponse.json(
        {
          message:
            "Lesson order already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const updatedLesson =
      await updateLesson(id, {
        title: title.trim(),
        content,
        order,
      });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error(
      "UPDATE_LESSON_API_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to update lesson.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const { id } = await context.params;

  try {
    const lesson = await getLessonById(id);

    if (!lesson) {
      return NextResponse.json(
        {
          message: "Lesson not found.",
        },
        {
          status: 404,
        }
      );
    }

    await deleteLesson(id);

    return NextResponse.json({
      message: "Lesson deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE_LESSON_API_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to delete lesson.",
      },
      {
        status: 500,
      }
    );
  }
}