import { NextResponse } from "next/server";

import { getAdminSession } from "@/libs/auth/admin";
import {
  createLesson,
  getLessonsByMaterialId,
} from "@/libs/service/lessons.service";
import { prisma } from "@/libs/prisma";

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

  const { id: materialId } =
    await context.params;

  const lessons =
    await getLessonsByMaterialId(materialId);

  return NextResponse.json(lessons);
}

export async function POST(
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

  const { id: materialId } =
    await context.params;

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

    const material =
      await prisma.material.findUnique({
        where: {
          id: materialId,
        },
      });

    if (!material) {
      return NextResponse.json(
        {
          message: "Material not found.",
        },
        {
          status: 404,
        }
      );
    }

    const existingLesson =
      await prisma.lesson.findFirst({
        where: {
          materialId,
          order,
        },
      });

    if (existingLesson) {
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

    const lesson = await createLesson({
      materialId,
      title: title.trim(),
      content,
      order,
    });

    return NextResponse.json(
      lesson,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE_LESSON_API_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to create lesson.",
      },
      {
        status: 500,
      }
    );
  }
}