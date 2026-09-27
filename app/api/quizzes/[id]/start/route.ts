import { NextResponse } from "next/server";

import { getSession } from "@/libs/auth/session";
import { prisma } from "@/libs/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Quiz ID is required" },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.findFirst({
      where: {
        id,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        duration: true,
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { message: "Quiz not found" },
        { status: 404 }
      );
    }

    const startedAt = new Date();

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        quizId: quiz.id,
        startedAt,
      },
    });

    return NextResponse.json(
      {
        message: "Quiz started",
        data: {
          attemptId: attempt.id,
          quizId: quiz.id,
          title: quiz.title,
          duration: quiz.duration,
          startedAt: attempt.startedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("START_QUIZ_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}