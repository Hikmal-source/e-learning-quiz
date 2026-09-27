
"use client";

import Link from "next/link";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type MaterialActionsProps = {
  materialId: string;
};

export default function MaterialActions({
  materialId,
}: MaterialActionsProps) {
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this material?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/admin/materials/${materialId} `,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        window.alert(
          data.message ?? "Failed to delete material."
        );
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "DELETE_MATERIAL_ERROR:",
        error
      );

      window.alert(
        "Something went wrong. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/materials/${materialId}/lessons`}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <BookOpen className="h-4 w-4" />
        Lessons
      </Link >

      <Link
        href={`/admin/materials/${materialId}/edit`}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <Pencil className="h-4 w-4" />
        Edit
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div >
  );
}
