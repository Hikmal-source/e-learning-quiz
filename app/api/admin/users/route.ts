import { NextResponse } from "next/server";

import { getAdminSession } from "@/libs/auth/admin";
import { getAdminUsers } from "@/libs/service/user-admin.service";

export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const users = await getAdminUsers();

    return NextResponse.json({
      data: users,
    });
  } catch (error) {
    console.error(
      "ADMIN_USERS_API_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to load users.",
      },
      {
        status: 500,
      }
    );
  }
}