import { NextResponse } from "next/server";

import { getAdminSession } from "@/libs/auth/admin";
import { getQuizById } from "@/libs/service/quiz-admin.service";
import {
  createQuizQuestion,
  getQuizQuestions,
} from "@/libs/service/quiz-question-admin.service";
import { createQuizQuestionSchema } from "@/libs/validation/quiz-question-schema-admin";

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
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id: quizId } = await context.params;

    const quiz = await getQuizById(quizId);

    if (!quiz) {
      return NextResponse.json(
        { message: "Quiz not found." },
        { status: 404 }
      );
    }

    const questions = await getQuizQuestions(quizId);

    return NextResponse.json(questions);
  } catch (error) {
    console.error(
      "GET_QUIZ_QUESTIONS_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to get quiz questions.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const { id: quizId } = await context.params;

    const quiz = await getQuizById(quizId);

    if (!quiz) {
      return NextResponse.json(
        { message: "Quiz not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const validation =
      createQuizQuestionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid quiz question data.",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      question,
      options,
      correctAnswer,
      explanation,
      order,
    } = validation.data;

    const existingQuestions =
      await getQuizQuestions(quizId);

    const duplicateOrder =
      existingQuestions.some(
        (item) => item.order === order
      );

    if (duplicateOrder) {
      return NextResponse.json(
        {
          message:
            "This question order is already used.",
        },
        { status: 409 }
      );
    }

    const quizQuestion =
      await createQuizQuestion({
        quizId,
        question,
        options,
        correctAnswer,
        explanation,
        order,
      });

    return NextResponse.json(
      quizQuestion,
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CREATE_QUIZ_QUESTION_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to add question to quiz.",
      },
      { status: 500 }
    );
  }
}