import { NextResponse } from "next/server";
import { getSession } from "@/libs/auth/session";
import { getPublishedMaterials } from "@/libs/service/material.service";

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const materials = await getPublishedMaterials();

    return NextResponse.json({
      data: materials,
    });
  } catch (error) {
    console.error("GET_MATERIALS_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}