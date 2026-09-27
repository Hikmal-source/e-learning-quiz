
import { prisma } from "@/libs/prisma";

export async function getQuizQuestions(
  quizId: string
) {
  return prisma.quizQuestion.findMany({
    where: {
      quizId,
    },
    orderBy: {
      order: "asc",
    },
    include: {
      question: true,
    },
  });
}

export async function getQuizQuestionById(
  id: string
) {
  return prisma.quizQuestion.findUnique({
    where: {
      id,
    },
    include: {
      question: true,
    },
  });
}

export async function createQuizQuestion(data: {
  quizId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  order: number;
}) {
  return prisma.$transaction(async (tx) => {
    const question = await tx.question.create({
      data: {
        question: data.question,
        options: data.options,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
      },
    });

    const quizQuestion =
      await tx.quizQuestion.create({
        data: {
          quizId: data.quizId,
          questionId: question.id,
          order: data.order,
        },
        include: {
          question: true,
        },
      });

    return quizQuestion;
  });
}

export async function updateQuizQuestion(
  id: string,
  data: {
    order?: number;
  }
) {
  return prisma.quizQuestion.update({
    where: {
      id,
    },
    data,
    include: {
      question: true,
    },
  });
}

export async function deleteQuizQuestion(
  id: string
) {
  return prisma.quizQuestion.delete({
    where: {
      id,
    },
  });
}

