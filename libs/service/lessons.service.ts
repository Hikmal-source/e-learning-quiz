import { prisma } from "@/libs/prisma";

export async function getLessonsByMaterialId(
  materialId: string
) {
  return prisma.lesson.findMany({
    where: {
      materialId,
    },
    orderBy: {
      order: "asc",
    },
  });
}

export async function getLessonById(id: string) {
  return prisma.lesson.findUnique({
    where: {
      id,
    },
  });
}

export async function createLesson(data: {
  materialId: string;
  title: string;
  content: string;
  order: number;
}) {
  return prisma.lesson.create({
    data,
  });
}

export async function updateLesson(
  id: string,
  data: {
    title?: string;
    content?: string;
    order?: number;
  }
) {
  return prisma.lesson.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteLesson(id: string) {
  return prisma.lesson.delete({
    where: {
      id,
    },
  });
}