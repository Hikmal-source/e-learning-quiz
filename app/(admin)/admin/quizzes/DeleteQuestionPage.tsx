"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type Props = {
  quizId: string;
};

export default function DeleteQuizButton({
  quizId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz? This will also remove its questions and related attempts."
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/quizzes/${quizId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        window.alert(
          data.message ||
          "Failed to delete quiz."
        );
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "DELETE_QUIZ_ERROR:",
        error
      );

      window.alert(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />

      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}