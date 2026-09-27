import { NextResponse } from "next/server";

import { getSession } from "@/libs/auth/session";
import { prisma } from "@/libs/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
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

    const { lessonId } = await params;

    if (!lessonId) {
      return NextResponse.json(
        {
          message: "Lesson ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        {
          message: "Lesson not found",
        },
        {
          status: 404,
        }
      );
    }

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Lesson completed",
        data: progress,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("COMPLETE_LESSON_ERROR:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}