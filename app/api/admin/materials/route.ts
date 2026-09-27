import { NextResponse } from "next/server";
import { getAdminSession } from "@/libs/auth/admin";
import {
  createMaterial,
  getMaterials,
} from "@/libs/service/material.service";
import { MaterialType } from "@/app/generated/prisma";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    );
  }

  const materials = await getMaterials();

  return NextResponse.json({
    data: materials,
  });
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      title,
      slug,
      description,
      category,
      type,
      published,
    } = body;

    if (
      !title ||
      !slug ||
      !description ||
      !category
    ) {
      return NextResponse.json(
        { message: "Invalid input" },
        { status: 400 }
      );
    }

    const materialType =
      type === "LINUX_COMMAND"
        ? MaterialType.LINUX_COMMAND
        : MaterialType.GENERAL;

    const material = await createMaterial({
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      category: category.trim(),
      type: materialType,
      published: Boolean(published),
    });

    return NextResponse.json(
      {
        message: "Material created successfully",
        data: material,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_MATERIAL_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}