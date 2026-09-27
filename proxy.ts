import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token;

  const isAdminRoute = pathname.startsWith("/admin");

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/materials") ||
    pathname.startsWith("/practice") ||
    pathname.startsWith("/quiz") ||
    pathname.startsWith("/leaderboard");

  // Belum login → halaman login
  if (!isLoggedIn && (isProtectedRoute || isAdminRoute)) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set(
      "callbackUrl",
      pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  // Participant mencoba masuk admin
  if (
    isLoggedIn &&
    isAdminRoute &&
    token.role !== "ADMIN"
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/materials/:path*",
    "/practice/:path*",
    "/quiz/:path*",
    "/leaderboard/:path*",
    "/admin/:path*",
  ],
};