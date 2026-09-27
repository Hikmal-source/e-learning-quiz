import { Navbar } from "@/app/components/layout/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main>{children}</main>
    </div>
  );
}