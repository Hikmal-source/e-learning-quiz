import Link from "next/link";
import {
  BookOpen,
  Clock,
  ArrowRight,
  Terminal,
  GitBranch,
  Container,
  Cloud,
} from "lucide-react";

import { getPublishedMaterials } from "@/libs/service/material.service";

const categoryIcons: Record<string, typeof Terminal> = {
  Linux: Terminal,
  "Version Control": GitBranch,
  Container: Container,
  Cloud: Cloud,
};

export default async function MaterialsPage() {
  const materials = await getPublishedMaterials();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Learning Materials
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Explore materials and build your technical foundation.
        </p>
      </div>

      {materials.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-400" />

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No materials available
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            There are no published materials yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {materials.map((material) => {
            const Icon = categoryIcons[material.category] ?? BookOpen;

            return (
              <Link
                key={material.id}
                href={`/materials/${material.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon className="h-6 w-6" />
                  </div>

                  <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
                </div>

                <div className="mt-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    {material.category}
                  </span>

                  <h2 className="mt-2 text-lg font-semibold text-slate-900">
                    {material.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                    {material.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center gap-2 pt-6 text-sm text-slate-500">
                  <Clock className="h-4 w-4" />


                  <span className="mx-1">•</span>

                  <span>{material.lessons.length} lessons</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}