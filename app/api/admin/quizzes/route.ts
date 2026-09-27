import { NextResponse } from "next/server";

import { getAdminSession } from "@/libs/auth/admin";
import {
  createQuiz,
  getQuizzes,
} from "@/libs/service/quiz-admin.service";
import { createQuizSchema } from "@/libs/validation/quis.schema";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const quizzes = await getQuizzes();

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error(
      "GET_QUIZZES_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to get quizzes.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const validation =
      createQuizSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid quiz data.",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const quiz = await createQuiz(
      validation.data
    );

    return NextResponse.json(
      quiz,
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CREATE_QUIZ_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to create quiz.",
      },
      { status: 500 }
    );
  }
}