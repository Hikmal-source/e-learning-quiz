"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminLogoutButton() {
  async function handleLogout() {
    await signOut({
      callbackUrl: "/",
    });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}