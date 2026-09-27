import Sidebar from "@/app/components/layout/sidebar";
import Topbar from "@/app/components/layout/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar />

        <main>{children}</main>
      </div>
    </div>
  );
}