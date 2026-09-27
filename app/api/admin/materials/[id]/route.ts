import { NextResponse } from "next/server";
import { getAdminSession } from "@/libs/auth/admin";
import {
  getMaterialById,
  updateMaterial,
  deleteMaterial
} from "@/libs/service/material.service";
import { MaterialType } from "@/app/generated/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const material = await getMaterialById(id);

    if (!material) {
      return NextResponse.json(
        { message: "Material not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: material,
    });
  } catch (error) {
    console.error("GET_MATERIAL_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
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
      typeof title !== "string" ||
      typeof slug !== "string" ||
      typeof description !== "string" ||
      typeof category !== "string"
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

    const material = await updateMaterial(id, {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      category: category.trim(),
      type: materialType,
      published: Boolean(published),
    });

    return NextResponse.json({
      message: "Material updated successfully",
      data: material,
    });
  } catch (error) {
    console.error("UPDATE_MATERIAL_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const material = await getMaterialById(id);

    if (!material) {
      return NextResponse.json(
        { message: "Material not found" },
        { status: 404 }
      );
    }

    await deleteMaterial(id);

    return NextResponse.json({
      message: "Material deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_MATERIAL_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}