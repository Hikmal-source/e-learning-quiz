import { getSession } from "@/libs/auth/session";

export async function getAdminSession() {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  if (session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}