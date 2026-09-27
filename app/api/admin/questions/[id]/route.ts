
import { NextResponse } from "next/server";

import { getAdminSession } from "@/libs/auth/admin";
import {
  deleteQuestion,
  getQuestionById,
  updateQuestion,
} from "@/libs/service/question.service";
import {
  updateQuestionSchema,
} from "@/libs/validation/question.schema";

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

  const { id } = await context.params;

  try {
    const question =
      await getQuestionById(id);

    if (!question) {
      return NextResponse.json(
        {
          message: "Question not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error(
      "GET_QUESTION_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to get question.",
      },
      { status: 500 }
    );
  }
}

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

  const { id } = await context.params;

  try {
    const existingQuestion =
      await getQuestionById(id);

    if (!existingQuestion) {
      return NextResponse.json(
        {
          message: "Question not found.",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const validation =
      updateQuestionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid question data.",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const question =
      await updateQuestion(
        id,
        validation.data
      );

    return NextResponse.json(question);
  } catch (error) {
    console.error(
      "UPDATE_QUESTION_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to update question.",
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

  const { id } = await context.params;

  try {
    const existingQuestion =
      await getQuestionById(id);

    if (!existingQuestion) {
      return NextResponse.json(
        {
          message: "Question not found.",
        },
        { status: 404 }
      );
    }

    await deleteQuestion(id);

    return NextResponse.json({
      message:
        "Question deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE_QUESTION_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to delete question.",
      },
      { status: 500 }
    );
  }
}

