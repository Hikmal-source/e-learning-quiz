import { NextResponse } from "next/server";
import { getSession } from "@/libs/auth/session";
import { getMaterialBySlug } from "@/libs/service/material.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { slug } = await params;

    const material = await getMaterialBySlug(slug);

    if (!material || !material.published) {
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