import { getSession } from "@/libs/auth/session";
import { UserCircle } from "lucide-react";

export default async function Topbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
      <div>
        <p className="text-sm text-slate-500">
          DevOps Learning Platform
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">
            {session?.user?.name ?? "Learner"}
          </p>

          <p className="text-xs text-slate-500">
            {session?.user?.role ?? "PARTICIPANT"}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <UserCircle className="h-6 w-6" />
        </div>
      </div>
    </header>
  );
}




