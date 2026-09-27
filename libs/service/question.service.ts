import { prisma } from "@/libs/prisma";

export async function getQuestions() {
  return prisma.question.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getQuestionById(id: string) {
  return prisma.question.findUnique({
    where: { id },
  });
}

export async function createQuestion(data: {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}) {
  return prisma.question.create({
    data,
  });
}

export async function updateQuestion(
  id: string,
  data: {
    question?: string;
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
  }
) {
  return prisma.question.update({
    where: { id },
    data,
  });
}

export async function deleteQuestion(id: string) {
  return prisma.question.delete({
    where: { id },
  });
}