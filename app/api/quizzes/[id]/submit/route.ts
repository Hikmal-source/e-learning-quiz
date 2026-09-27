import { NextResponse } from "next/server";

import { getSession } from "@/libs/auth/session";
import { prisma } from "@/libs/prisma";

interface SubmitQuizBody {
  attemptId: string;
  answers: Record<string, number>;
}

export async function POST(
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
     * REQUEST BODY
     * ========================================
     */

    let body: SubmitQuizBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          message: "Invalid JSON body",
        },
        {
          status: 400,
        }
      );
    }

    const { attemptId, answers } = body;

    /*
     * ========================================
     * BASIC VALIDATION
     * ========================================
     */

    if (
      typeof attemptId !== "string" ||
      !attemptId
    ) {
      return NextResponse.json(
        {
          message: "Attempt ID is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !answers ||
      typeof answers !== "object" ||
      Array.isArray(answers)
    ) {
      return NextResponse.json(
        {
          message: "Invalid answers format",
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
     * Attempt harus milik user yang sedang login.
     */

    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        id: attemptId,
        quizId,
        userId: session.user.id,
      },
      select: {
        id: true,
        userId: true,
        quizId: true,
        startedAt: true,
        submittedAt: true,
        score: true,
        duration: true,
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
     * PREVENT DOUBLE SUBMISSION
     * ========================================
     */

    if (attempt.submittedAt) {
      return NextResponse.json(
        {
          message: "Quiz has already been submitted",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * ========================================
     * FIND QUIZ
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
        duration: true,

        questions: {
          orderBy: {
            order: "asc",
          },
          select: {
            order: true,

            question: {
              select: {
                id: true,
                correctAnswer: true,
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
     * CALCULATE SERVER-SIDE DURATION
     * ========================================
     *
     * Jangan percaya timer dari browser.
     */

    const now = new Date();

    const elapsedSeconds = Math.max(
      0,
      Math.floor(
        (now.getTime() - attempt.startedAt.getTime()) /
        1000
      )
    );

    const quizDurationSeconds =
      quiz.duration * 60;

    /*
     * ========================================
     * CHECK TIME LIMIT
     * ========================================
     */

    const timeExpired =
      elapsedSeconds >= quizDurationSeconds;

    /*
     * ========================================
     * VALIDATE ANSWERS
     * ========================================
     */

    for (const [questionId, answer] of Object.entries(
      answers
    )) {
      if (
        typeof answer !== "number" ||
        !Number.isInteger(answer)
      ) {
        return NextResponse.json(
          {
            message: `Invalid answer for question ${questionId}`,
          },
          {
            status: 400,
          }
        );
      }

      const question = quiz.questions.find(
        (item) =>
          item.question.id === questionId
      );

      if (!question) {
        return NextResponse.json(
          {
            message: `Invalid question ID: ${questionId}`,
          },
          {
            status: 400,
          }
        );
      }

      /*
       * Saat ini answer berupa index option:
       *
       * 0 = A
       * 1 = B
       * 2 = C
       * 3 = D
       */

      if (answer < 0 || answer > 3) {
        return NextResponse.json(
          {
            message: `Invalid answer index for question ${questionId}`,
          },
          {
            status: 400,
          }
        );
      }
    }

    /*
     * ========================================
     * REQUIRE ALL ANSWERS
     * ========================================
     *
     * Kalau waktu belum habis,
     * semua pertanyaan harus dijawab.
     */

    if (!timeExpired) {
      const unansweredQuestion =
        quiz.questions.find(
          (item) =>
            answers[item.question.id] === undefined
        );

      if (unansweredQuestion) {
        return NextResponse.json(
          {
            message: `Question ${unansweredQuestion.order} has not been answered`,
          },
          {
            status: 400,
          }
        );
      }
    }

    /*
     * ========================================
     * CALCULATE SCORE
     * ========================================
     *
     * SCORE SEPENUHNYA DI SERVER.
     *
     * Client tidak pernah mengirim score.
     */

    let correctCount = 0;

    for (const item of quiz.questions) {
      const questionId = item.question.id;

      const submittedAnswer =
        answers[questionId];

      if (
        submittedAnswer === undefined
      ) {
        continue;
      }

      const correctAnswer =
        item.question.correctAnswer;

      if (
        submittedAnswer === correctAnswer
      ) {
        correctCount++;
      }
    }

    const totalQuestions =
      quiz.questions.length;

    const score =
      totalQuestions > 0
        ? Math.round(
          (correctCount / totalQuestions) * 100
        )
        : 0;

    /*
     * ========================================
     * FINAL DURATION
     * ========================================
     *
     * Simpan durasi aktual berdasarkan server.
     * Tidak menggunakan timer dari browser.
     */

    const finalDuration = Math.min(
      elapsedSeconds,
      quizDurationSeconds
    );

    /*
     * ========================================
     * SAVE ATTEMPT
     * ========================================
     */

    const updatedAttempt =
      await prisma.quizAttempt.update({
        where: {
          id: attempt.id,
        },
        data: {
          submittedAt: now,
          score,
          duration: finalDuration,
          answers,
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

    /*
     * ========================================
     * RESPONSE
     * ========================================
     *
     * Jangan kirim correctAnswer ke client.
     */

    return NextResponse.json(
      {
        message: "Quiz submitted successfully",

        data: {
          attemptId: updatedAttempt.id,
          quizId: updatedAttempt.quizId,
          score: updatedAttempt.score,
          duration: updatedAttempt.duration,
          startedAt: updatedAttempt.startedAt,
          submittedAt:
            updatedAttempt.submittedAt,
          correctCount,
          totalQuestions,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "SUBMIT_QUIZ_ERROR:",
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