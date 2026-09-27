import Link from "next/link";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/libs/auth/admin";
import { prisma } from "@/libs/prisma";
import LessonActions from "@/app/(admin)/admin/materials/[id]/lessons/lessonsAction";
import LessonContent from "@/app/components/materials/lesson-content";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LessonsPage({
  params,
}: PageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/dashboard");
  }

  const { id: materialId } = await params;

  const material = await prisma.material.findUnique({
    where: {
      id: materialId,
    },
    include: {
      lessons: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!material) {
    redirect("/admin/materials");
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/materials"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Materials
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <BookOpen className="h-4 w-4" />
              <span>Material Lessons</span>
            </div>

            <h1 className="text-2xl font-semibold text-slate-900">
              {material.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage lessons inside this material.
            </p>
          </div>

          <Link
            href={`/admin/materials/${materialId}/lessons/create`}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Lesson
          </Link>
        </div>
      </div>

      {/* Lesson List */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Lessons
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {material.lessons.length}{" "}
            {material.lessons.length === 1
              ? "lesson"
              : "lessons"}{" "}
            available
          </p>
        </div>

        {material.lessons.length === 0 ? (
          <div className="px-6 py-14 text-center ">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              No lessons yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Start by creating the first lesson for this
              material.
            </p>

            <Link
              href={`/admin/materials/${materialId}/lessons/create`}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Create First Lesson
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {material.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center gap-4 px-6 py-4 transition hover:bg-slate-50"
              >
                {/* Order */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
                  {lesson.order}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-slate-900">
                    {lesson.title}
                  </h3>

                  {/* <div className="mt-1 truncate text-xs text-slate-500">
                    <LessonContent content={lesson.content} />
                  </div> */}
                </div>

                {/* Actions */}
                <LessonActions
                  lessonId={lesson.id}
                  materialId={materialId}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}