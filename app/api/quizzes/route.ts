import { NextResponse } from "next/server";

import { getSession } from "@/libs/auth/session";
import { getPublishedQuizzes } from "@/libs/service/quiz.service";

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const quizzes = await getPublishedQuizzes();

    const data = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      questionCount: quiz.questions.length,
      createdAt: quiz.createdAt,
    }));

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error("GET_QUIZZES_ERROR:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}