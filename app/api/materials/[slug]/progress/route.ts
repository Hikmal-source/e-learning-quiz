import { NextResponse } from "next/server";

import { getSession } from "@/libs/auth/session";
import { prisma } from "@/libs/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
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

    const { slug } = await params;

    const material = await prisma.material.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (!material) {
      return NextResponse.json(
        {
          message: "Material not found",
        },
        {
          status: 404,
        }
      );
    }

    const progress = await prisma.lessonProgress.findMany({
      where: {
        userId: session.user.id,
        lesson: {
          materialId: material.id,
        },
        completed: true,
      },
      select: {
        lessonId: true,
      },
    });

    const completedLessonIds = progress.map(
      (item) => item.lessonId
    );

    return NextResponse.json({
      data: {
        completedLessonIds,
      },
    });
  } catch (error) {
    console.error("GET_LESSON_PROGRESS_ERROR:", error);

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