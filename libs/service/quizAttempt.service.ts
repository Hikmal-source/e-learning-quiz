import { prisma } from "@/libs/prisma";

export async function getQuizAttempts(quizId: string) {
  return prisma.quizAttempt.findMany({
    where: {
      quizId,
    },
    include: {
      user: true,
      quiz: true,
    },
    orderBy: [
      {
        score: "desc",
      },
      {
        duration: "asc",
      },
    ],
  });
}

export async function getUserAttempts(userId: string) {
  return prisma.quizAttempt.findMany({
    where: {
      userId,
    },
    include: {
      quiz: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}