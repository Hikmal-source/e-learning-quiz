import { NextResponse } from "next/server";
import { registerSchema } from "@/libs/validation/user.schema";
import {
  getUserByEmail,
  createUser,
} from "@/libs/service/user.service";
import { hashPassword } from "@/libs/auth/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await createUser({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}