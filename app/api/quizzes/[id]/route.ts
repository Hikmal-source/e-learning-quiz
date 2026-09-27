import { NextResponse } from "next/server";

import { getSession } from "@/libs/auth/session";
import { getPublishedQuizById } from "@/libs/service/quiz.service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Quiz ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const quiz = await getPublishedQuizById(id);

    if (!quiz) {
      return NextResponse.json(
        {
          message: "Quiz not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      data: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        duration: quiz.duration,
        questionCount: quiz.questions.length,

        questions: quiz.questions.map((item) => ({
          id: item.question.id,
          order: item.order,
          question: item.question.question,
          options: item.question.options,
        })),
      },
    });
  } catch (error) {
    console.error("GET_QUIZ_DETAIL_ERROR:", error);

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