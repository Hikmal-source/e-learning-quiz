import { prisma } from "@/libs/prisma";

export async function getPublishedQuizzes() {
  return prisma.quiz.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      duration: true,
      isPublished: true,
      createdAt: true,

      questions: {
        select: {
          id: true,
        },
      },
    },
  });
}

export async function getPublishedQuizById(id: string) {
  return prisma.quiz.findFirst({
    where: {
      id,
      isPublished: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      duration: true,

      questions: {
        orderBy: {
          order: "asc",
        },
        select: {
          id: true,
          order: true,

          question: {
            select: {
              id: true,
              question: true,
              options: true,
            },
          },
        },
      },
    },
  });
}