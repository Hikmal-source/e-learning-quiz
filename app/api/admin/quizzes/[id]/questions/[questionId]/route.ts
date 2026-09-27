
import { NextResponse } from "next/server";

import { getAdminSession } from "@/libs/auth/admin";
import {
  getQuizById,
} from "@/libs/service/quiz-admin.service";
import {
  getQuizQuestionById,
  updateQuizQuestion,
  deleteQuizQuestion,
  getQuizQuestions
} from "@/libs/service/quiz-question-admin.service";
import {
  updateQuizQuestionSchema,
} from "@/libs/validation/quiz-question-schema-admin";

type RouteContext = {
  params: Promise<{
    id: string;
    questionId: string;
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

  const {
    id: quizId,
    questionId: quizQuestionId,
  } = await context.params;

  try {
    const quiz =
      await getQuizById(quizId);

    if (!quiz) {
      return NextResponse.json(
        {
          message: "Quiz not found.",
        },
        { status: 404 }
      );
    }

    const quizQuestion =
      await getQuizQuestionById(
        quizQuestionId
      );

    if (
      !quizQuestion ||
      quizQuestion.quizId !== quizId
    ) {
      return NextResponse.json(
        {
          message:
            "Quiz question not found.",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const validation =
      updateQuizQuestionSchema.safeParse(
        body
      );

    if (!validation.success) {
      return NextResponse.json(
        {
          message:
            "Invalid quiz question data.",
          errors:
            validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const existingQuestions =
      await getQuizQuestions(quizId);

    const duplicateOrder =
      existingQuestions.some(
        (item) =>
          item.id !== quizQuestionId &&
          item.order ===
          validation.data.order
      );

    if (duplicateOrder) {
      return NextResponse.json(
        {
          message:
            "This order is already used.",
        },
        { status: 409 }
      );
    }

    const updatedQuizQuestion =
      await updateQuizQuestion(
        quizQuestionId,
        validation.data
      );

    return NextResponse.json(
      updatedQuizQuestion
    );
  } catch (error) {
    console.error(
      "UPDATE_QUIZ_QUESTION_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to update quiz question.",
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

  const {
    id: quizId,
    questionId: quizQuestionId,
  } = await context.params;

  try {
    const quiz =
      await getQuizById(quizId);

    if (!quiz) {
      return NextResponse.json(
        {
          message: "Quiz not found.",
        },
        { status: 404 }
      );
    }

    const quizQuestion =
      await getQuizQuestionById(
        quizQuestionId
      );

    if (
      !quizQuestion ||
      quizQuestion.quizId !== quizId
    ) {
      return NextResponse.json(
        {
          message:
            "Quiz question not found.",
        },
        { status: 404 }
      );
    }

    await deleteQuizQuestion(
      quizQuestionId
    );

    return NextResponse.json({
      message:
        "Question removed from quiz successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE_QUIZ_QUESTION_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to remove question from quiz.",
      },
      { status: 500 }
    );
  }
}

