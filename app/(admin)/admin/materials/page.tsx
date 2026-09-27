import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/libs/auth/admin";
import { prisma } from "@/libs/prisma";
import MaterialActions from "@/app/(admin)/admin/materials/materialActions";

export default async function AdminMaterialsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/dashboard");
  }

  const materials = await prisma.material.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      lessons: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Content Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Materials
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage learning materials and lessons.
          </p>
        </div>

        <Link
          href="/admin/materials/create"
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Create Material
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-slate-600">
                Material
              </th>

              <th className="px-6 py-4 text-left font-semibold text-slate-600">
                Category
              </th>

              <th className="px-6 py-4 text-left font-semibold text-slate-600">
                Lessons
              </th>

              <th className="px-6 py-4 text-left font-semibold text-slate-600">
                Status
              </th>

              <th className="px-6 py-4 text-right font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {materials.map((material) => (
              <tr
                key={material.id}
                className="transition hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {material.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {material.slug}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {material.category}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {material.lessons.length}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${material.published
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                      }`}
                  >
                    {material.published
                      ? "Published"
                      : "Draft"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <MaterialActions
                    materialId={material.id}
                  />
                </td>
              </tr>
            ))}

            {materials.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-slate-400"
                >
                  No materials available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}