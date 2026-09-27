"use client";

import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  Mail,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

type UserRole = "ADMIN" | "PARTICIPANT";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/users",
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Failed to load users."
        );
      }

      setUsers(result.data ?? []);
    } catch (error) {
      console.error(
        "ADMIN_USERS_ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalUsers = users.length;

  const totalAdmins = useMemo(() => {
    return users.filter(
      (user) => user.role === "ADMIN"
    ).length;
  }, [users]);

  const totalParticipants = useMemo(() => {
    return users.filter(
      (user) =>
        user.role === "PARTICIPANT"
    ).length;
  }, [users]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString(
      "id-ID",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getInitial = (
    name: string | null
  ) => {
    return (name ?? "U")
      .charAt(0)
      .toUpperCase();
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8 lg:py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Users
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage and monitor registered accounts.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          {/* Total Users */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Users
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {totalUsers}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Users className="h-5 w-5 text-slate-500" />
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Participants
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-600">
                  {totalParticipants}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <UserRound className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Administrators */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Administrators
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {totalAdmins}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <ShieldCheck className="h-5 w-5 text-slate-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Registered Accounts */}
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Registered Accounts
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              All accounts registered in the system.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <p className="text-sm text-slate-500">
                Loading users...
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            users.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <Users className="mx-auto h-10 w-10 text-slate-300" />

                <h2 className="mt-4 text-base font-semibold text-slate-900">
                  No registered users
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Registered accounts will appear here.
                </p>
              </div>
            )}

          {/* User Cards */}
          {!loading &&
            users.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    {/* User Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">

                        {/* Avatar */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-base font-bold text-emerald-700">
                          {getInitial(user.name)}
                        </div>

                        {/* Name */}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {user.name ??
                              "Unknown User"}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            Registered account
                          </p>
                        </div>
                      </div>

                      {/* Role */}
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${user.role ===
                            "ADMIN"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-emerald-50 text-emerald-700"
                          }`}
                      >
                        {user.role}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="my-5 border-t border-slate-100" />

                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                        <Mail className="h-4 w-4 text-slate-400" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                          Email
                        </p>

                        <p className="mt-0.5 truncate text-sm text-slate-600">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Registered */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                      </div>

                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                          Registered
                        </p>

                        <p className="mt-0.5 text-sm text-slate-600">
                          {formatDate(
                            user.createdAt
                          )}
                        </p>

                        <p className="text-xs text-slate-400">
                          {formatTime(
                            user.createdAt
                          )}
                        </p>
                      </div>
                    </div>

                    {/* User ID */}
                    <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2">
                      <p className="truncate font-mono text-[10px] text-slate-400">
                        ID: {user.id}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}