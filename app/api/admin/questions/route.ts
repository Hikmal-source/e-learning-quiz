
import { NextResponse } from "next/server";

import { getAdminSession } from "@/libs/auth/admin";
import {
  createQuestion,
  getQuestions,
} from "@/libs/service/question.service";
import {
  createQuestionSchema,
} from "@/libs/validation/question.schema";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const questions = await getQuestions();

    return NextResponse.json(questions);
  } catch (error) {
    console.error(
      "GET_QUESTIONS_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to get questions.",
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
      createQuestionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid question data.",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const question = await createQuestion(
      validation.data
    );

    return NextResponse.json(
      question,
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CREATE_QUESTION_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to create question.",
      },
      { status: 500 }
    );
  }
}

