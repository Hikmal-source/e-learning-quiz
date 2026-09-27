import { prisma } from "@/libs/prisma";
import { MaterialType } from "@/app/generated/prisma";

export async function getMaterials() {
  return prisma.material.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getPublishedMaterials() {
  return prisma.material.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getMaterialById(id: string) {
  return prisma.material.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getMaterialBySlug(slug: string) {
  return prisma.material.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function createMaterial(data: {
  title: string;
  slug: string;
  description: string;
  category: string;
  type?: MaterialType;
  published?: boolean;
}) {
  return prisma.material.create({
    data,
  });
}

export async function updateMaterial(
  id: string,
  data: {
    title?: string;
    slug?: string;
    description?: string;
    category?: string;
    type?: MaterialType;
    published?: boolean;
  }
) {
  return prisma.material.update({
    where: { id },
    data,
  });
}

export async function deleteMaterial(id: string) {
  return prisma.material.delete({
    where: { id },
  });
}