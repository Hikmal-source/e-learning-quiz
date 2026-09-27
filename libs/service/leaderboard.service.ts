import { prisma } from "@/libs/prisma";

export async function getLeaderboard() {
  return prisma.quizAttempt.findMany({
    where: {
      submittedAt: {
        not: null,
      },
    },
    orderBy: [
      {
        score: "desc",
      },
      {
        duration: "asc",
      },
      {
        submittedAt: "asc",
      },
    ],
    select: {
      id: true,
      score: true,
      duration: true,
      submittedAt: true,

      user: {
        select: {
          id: true,
          name: true,
        },
      },

      quiz: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}