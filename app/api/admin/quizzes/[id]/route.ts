import { NextResponse } from "next/server";

import { getAdminSession } from "@/libs/auth/admin";
import {
  deleteQuiz,
  getQuizById,
  updateQuiz,
} from "@/libs/service/quiz-admin.service";
import { updateQuizSchema } from "@/libs/validation/quis.schema";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;

    const quiz = await getQuizById(id);

    if (!quiz) {
      return NextResponse.json(
        { message: "Quiz not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const validation =
      updateQuizSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid quiz data.",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updatedQuiz = await updateQuiz(
      id,
      validation.data
    );

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error(
      "UPDATE_QUIZ_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to update quiz.",
      },
      { status: 500 }
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
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;

    const quiz = await getQuizById(id);

    if (!quiz) {
      return NextResponse.json(
        { message: "Quiz not found." },
        { status: 404 }
      );
    }

    await deleteQuiz(id);

    return NextResponse.json({
      message: "Quiz deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE_QUIZ_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to delete quiz.",
      },
      { status: 500 }
    );
  }
}