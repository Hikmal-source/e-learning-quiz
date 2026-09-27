
import { prisma } from "@/libs/prisma";

export async function getQuizzes() {
  return prisma.quiz.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      questions: {
        orderBy: {
          order: "asc",
        },
        include: {
          question: true,
        },
      },
    },
  });
}

export async function getQuizById(id: string) {
  return prisma.quiz.findUnique({
    where: {
      id,
    },
    include: {
      questions: {
        orderBy: {
          order: "asc",
        },
        include: {
          question: true,
        },
      },
    },
  });
}

export async function createQuiz(data: {
  title: string;
  description?: string;
  duration: number;
}) {
  return prisma.quiz.create({
    data,
  });
}

export async function updateQuiz(
  id: string,
  data: {
    title?: string;
    description?: string;
    duration?: number;
    isPublished?: boolean;
  }
) {
  return prisma.quiz.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteQuiz(id: string) {
  return prisma.quiz.delete({
    where: {
      id,
    },
  });
}

