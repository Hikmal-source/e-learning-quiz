"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type Props = {
  quizId: string;
  questionId: string;
};

export default function DeleteQuestionButton({
  quizId,
  questionId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to remove this question from the quiz?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/quizzes/${quizId}/questions/${questionId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        window.alert(
          data.message ||
          "Failed to delete question."
        );
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "DELETE_QUIZ_QUESTION_ERROR:",
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Delete question"
      title="Delete question"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}