import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth/auth";

export async function getSession() {
  return getServerSession(authOptions);
}