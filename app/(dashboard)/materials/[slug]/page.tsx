import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle2,
} from "lucide-react";
import LessonAccordion from "@/app/components/materials/lesson-accordion";
import { getMaterialBySlug } from "@/libs/service/material.service";

interface MaterialDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MaterialDetailPage({
  params,
}: MaterialDetailPageProps) {
  const { slug } = await params;

  const material = await getMaterialBySlug(slug);

  if (!material || !material.published) {
    notFound();
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/materials"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Materials
        </Link>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                {material.category}
              </span>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {material.title}
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-slate-500">
                {material.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">

                <span className="inline-flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {material.lessons.length} lessons
                </span>
              </div>
            </div>


          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">
            Course Lessons
          </h2>

          <div className="my-4">
            <LessonAccordion lessons={material.lessons} materialSlug={material.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}