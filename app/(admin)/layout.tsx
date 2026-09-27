import { redirect } from "next/navigation";

import AdminSidebar from "@/app/components/admin/sidebar";
import { getAdminSession } from "@/libs/auth/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:pl-64">
        <main>{children}</main>
      </div>
    </div>
  );
}