import { NextResponse } from "next/server";

import { getSession } from "@/libs/auth/session";
import { getLeaderboard } from "@/libs/service/leaderboard.service";

export async function GET() {
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

    const attempts = await getLeaderboard();

    const data = attempts.map((attempt, index) => ({
      rank: index + 1,

      attemptId: attempt.id,

      user: {
        id: attempt.user.id,
        name: attempt.user.name,
      },

      quiz: {
        id: attempt.quiz.id,
        title: attempt.quiz.title,
      },

      score: attempt.score,
      duration: attempt.duration,
      submittedAt: attempt.submittedAt,
    }));

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error(
      "GET_LEADERBOARD_ERROR:",
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