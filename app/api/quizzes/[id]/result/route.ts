import { NextResponse } from "next/server";

import { getSession } from "@/libs/auth/session";
import { prisma } from "@/libs/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    /*
     * ========================================
     * AUTHENTICATION
     * ========================================
     */

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

    /*
     * ========================================
     * PARAMS
     * ========================================
     */

    const { id: quizId } = await params;

    if (!quizId) {
      return NextResponse.json(
        {
          message: "Quiz ID is required",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ========================================
     * ATTEMPT ID
     * ========================================
     */

    const { searchParams } = new URL(request.url);

    const attemptId =
      searchParams.get("attemptId");

    if (!attemptId) {
      return NextResponse.json(
        {
          message: "Attempt ID is required",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ========================================
     * FIND ATTEMPT
     * ========================================
     *
     * IMPORTANT:
     * User hanya boleh melihat attempt miliknya.
     */

    const attempt =
      await prisma.quizAttempt.findFirst({
        where: {
          id: attemptId,
          quizId,
          userId: session.user.id,
        },
        select: {
          id: true,
          quizId: true,
          score: true,
          duration: true,
          startedAt: true,
          submittedAt: true,
        },
      });

    if (!attempt) {
      return NextResponse.json(
        {
          message: "Quiz attempt not found",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ========================================
     * QUIZ
     * ========================================
     */

    const quiz = await prisma.quiz.findFirst({
      where: {
        id: quizId,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,

        questions: {
          orderBy: {
            order: "asc",
          },
          select: {
            question: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

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

    /*
     * ========================================
     * RESPONSE
     * ========================================
     */

    return NextResponse.json({
      data: {
        attemptId: attempt.id,
        quizId: quiz.id,

        title: quiz.title,
        description: quiz.description,

        score: attempt.score,
        duration: attempt.duration,

        totalQuestions:
          quiz.questions.length,

        submittedAt: attempt.submittedAt,
      },
    });
  } catch (error) {
    console.error(
      "GET_QUIZ_RESULT_ERROR:",
      error
    );

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