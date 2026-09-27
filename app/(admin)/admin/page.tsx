import {
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  Users,
} from "lucide-react";

import { getAdminSession } from "@/libs/auth/admin";
import { prisma } from "@/libs/prisma";

import AdminLogoutButton from "@/app/(admin)/admin/ButtonAdminLogout";
import AdminResourceChart from "@/app/(admin)/admin/AdminResourceCharts";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    return null;
  }

  const [
    totalUsers,
    totalParticipants,
    totalAdmins,
    totalMaterials,
    publishedMaterials,
    totalLessons,
    totalQuizzes,
    publishedQuizzes,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        role: "PARTICIPANT",
      },
    }),

    prisma.user.count({
      where: {
        role: "ADMIN",
      },
    }),

    prisma.material.count(),

    prisma.material.count({
      where: {
        published: true,
      },
    }),

    prisma.lesson.count(),

    prisma.quiz.count(),

    prisma.quiz.count({
      where: {
        isPublished: true,
      },
    }),
  ]);

  const draftMaterials =
    totalMaterials - publishedMaterials;

  const draftQuizzes =
    totalQuizzes - publishedQuizzes;

  const resourceData = [
    {
      name: "Users",
      value: totalUsers,
    },
    {
      name: "Materials",
      value: totalMaterials,
    },
    {
      name: "Lessons",
      value: totalLessons,
    },
    {
      name: "Quizzes",
      value: totalQuizzes,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8 lg:py-10">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              Admin Panel
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Welcome, {session.user.name}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage DevLearn resources,
              participants, and learning content.
            </p>
          </div>

          <AdminLogoutButton />
        </div>

        {/* Main Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Users */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Users
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalUsers}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {totalParticipants} participants ·{" "}
                  {totalAdmins} admins
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Materials
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalMaterials}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {publishedMaterials} published ·{" "}
                  {draftMaterials} drafts
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <BookOpen className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Lessons
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalLessons}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Learning content
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Quizzes */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Quizzes
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalQuizzes}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {publishedQuizzes} published ·{" "}
                  {draftQuizzes} drafts
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <ClipboardList className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* Resource Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Platform Resources
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Overview of the resources currently available
                in DevLearn.
              </p>
            </div>

            <AdminResourceChart
              data={resourceData}
            />
          </div>

          {/* Publishing Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Content Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current publishing status.
              </p>
            </div>

            <div className="space-y-6">

              {/* Materials */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                      <BookOpen className="h-4 w-4 text-emerald-600" />
                    </div>

                    <span className="text-sm font-medium text-slate-700">
                      Materials
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-slate-900">
                    {publishedMaterials}/{totalMaterials}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width:
                        totalMaterials > 0
                          ? `${(publishedMaterials / totalMaterials) * 100}%`
                          : "0%",
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  {publishedMaterials} published,{" "}
                  {draftMaterials} drafts
                </p>
              </div>

              {/* Quizzes */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                      <ClipboardList className="h-4 w-4 text-emerald-600" />
                    </div>

                    <span className="text-sm font-medium text-slate-700">
                      Quizzes
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-slate-900">
                    {publishedQuizzes}/{totalQuizzes}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width:
                        totalQuizzes > 0
                          ? `${(publishedQuizzes / totalQuizzes) * 100}%`
                          : "0%",
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  {publishedQuizzes} published,{" "}
                  {draftQuizzes} drafts
                </p>
              </div>

              {/* Learning */}
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <GraduationCap className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Learning Resources
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {totalMaterials} materials ·{" "}
                      {totalLessons} lessons ·{" "}
                      {totalQuizzes} quizzes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Summary */}
        <section className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-700">
                DevLearn Administration
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Keep the learning platform organized.
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage users, learning materials, lessons,
                quizzes, and participant performance from
                the admin panel.
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
              <GraduationCap className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}