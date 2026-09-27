"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Settings,
  Trophy,
  Users,
} from "lucide-react";

const menuGroups = [
  {
    label: "ADMIN",
    items: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: BarChart3,
      },
      {
        name: "Materials",
        href: "/admin/materials",
        icon: BookOpen,
      },
      {
        name: "Quizzes",
        href: "/admin/quizzes",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        name: "Participants",
        href: "/admin/users",
        icon: Users,
      },
      {
        name: "Results",
        href: "/admin/leaderboard",
        icon: Trophy,
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Link
          href="/admin"
          className="text-xl font-bold tracking-tight text-emerald-600"
        >
          DevLearn
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-7">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400">
                {group.label}
              </p>

              <div className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-500">
            Admin Panel
          </p>
          <p className="mt-1 text-xs text-slate-400">
            DevLearn Management
          </p>
        </div>
      </div>
    </aside>
  );
}