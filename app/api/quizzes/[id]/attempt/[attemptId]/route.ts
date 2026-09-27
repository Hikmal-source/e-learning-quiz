import { NextResponse } from "next/server";

import { getSession } from "@/libs/auth/session";
import { prisma } from "@/libs/prisma";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      attemptId: string;
    }>;
  }
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

    const { id: quizId, attemptId } =
      await params;

    if (!quizId || !attemptId) {
      return NextResponse.json(
        {
          message:
            "Quiz ID and Attempt ID are required",
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
     * Attempt wajib milik user yang login.
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
          startedAt: true,
          submittedAt: true,
          answers: true,

          quiz: {
            select: {
              id: true,
              title: true,
              duration: true,
              isPublished: true,
            },
          },
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
     * CHECK QUIZ
     * ========================================
     */

    if (!attempt.quiz.isPublished) {
      return NextResponse.json(
        {
          message: "Quiz is not available",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ========================================
     * CALCULATE TIME
     * ========================================
     *
     * Semua berdasarkan waktu server.
     */

    const now = new Date();

    const elapsedSeconds = Math.max(
      0,
      Math.floor(
        (now.getTime() -
          attempt.startedAt.getTime()) /
        1000
      )
    );

    const totalSeconds =
      attempt.quiz.duration * 60;

    const remainingSeconds = Math.max(
      0,
      totalSeconds - elapsedSeconds
    );

    const expired =
      remainingSeconds <= 0;

    /*
     * ========================================
     * RESPONSE
     * ========================================
     */

    return NextResponse.json({
      data: {
        attemptId: attempt.id,
        quizId: attempt.quizId,

        title: attempt.quiz.title,

        duration: attempt.quiz.duration,

        startedAt: attempt.startedAt,

        submittedAt: attempt.submittedAt,

        serverTime: now,

        elapsedSeconds,

        remainingSeconds,

        expired,
        answers: attempt.answers ?? {},
      },
    });
  } catch (error) {
    console.error(
      "GET_QUIZ_ATTEMPT_ERROR:",
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

interface SaveAnswersBody {
  answers: Record<string, number>;
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      attemptId: string;
    }>;
  }
) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: quizId, attemptId } = await params;

    if (!quizId || !attemptId) {
      return NextResponse.json(
        {
          message: "Quiz ID and Attempt ID are required",
        },
        { status: 400 }
      );
    }

    let body: SaveAnswersBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { answers } = body;

    if (
      !answers ||
      typeof answers !== "object" ||
      Array.isArray(answers)
    ) {
      return NextResponse.json(
        { message: "Invalid answers format" },
        { status: 400 }
      );
    }

    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        id: attemptId,
        quizId,
        userId: session.user.id,
      },
      select: {
        id: true,
        submittedAt: true,
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { message: "Quiz attempt not found" },
        { status: 404 }
      );
    }

    if (attempt.submittedAt) {
      return NextResponse.json(
        { message: "Quiz has already been submitted" },
        { status: 409 }
      );
    }

    for (const [questionId, answer] of Object.entries(
      answers
    )) {
      if (
        typeof answer !== "number" ||
        !Number.isInteger(answer) ||
        answer < 0
      ) {
        return NextResponse.json(
          {
            message: `Invalid answer for question ${questionId}`,
          },
          { status: 400 }
        );
      }
    }

    const updatedAttempt =
      await prisma.quizAttempt.update({
        where: {
          id: attempt.id,
        },
        data: {
          answers,
        },
        select: {
          id: true,
          answers: true,
        },
      });

    return NextResponse.json({
      message: "Answers saved",
      data: {
        attemptId: updatedAttempt.id,
        answers: updatedAttempt.answers ?? {},
      },
    });
  } catch (error) {
    console.error("SAVE_QUIZ_ANSWERS_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}