
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  FileQuestion,
  Hash,
} from "lucide-react";

type Props = {
  quizId: string;
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string | null;
  order: number;
};

export default function QuestionEditForm({
  quizId,
  questionId,
  question,
  options,
  correctAnswer,
  explanation,
  order,
}: Props) {
  const router = useRouter();

  const [newOrder, setNewOrder] = useState(order);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/quizzes/${quizId}/questions/${questionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order: Number(newOrder),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
          "Failed to update question."
        );
        return;
      }

      router.push(
        `/admin/quizzes/${quizId}/questions`
      );

      router.refresh();
    } catch (error) {
      console.error(
        "UPDATE_QUIZ_QUESTION_ERROR:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Question Preview */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FileQuestion className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Question
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Question content is shown for reference.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm leading-6 text-slate-700">
              {question}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {options.map((option, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="pt-1 text-sm leading-5 text-slate-600">
                  {option}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <p className="text-xs font-semibold text-emerald-700">
              Correct Answer
            </p>

            <p className="mt-1 text-sm text-emerald-800">
              {String.fromCharCode(
                65 + correctAnswer
              )}{" "}
              — {options[correctAnswer]}
            </p>
          </div>

          {explanation && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold text-slate-500">
                Explanation
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                {explanation}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Question Order */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Hash className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Question Order
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Change where this question appears in the quiz.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-sm">
            <label
              htmlFor="order"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Order
            </label>

            <input
              id="order"
              type="number"
              min={1}
              value={newOrder}
              onChange={(event) =>
                setNewOrder(
                  Number(event.target.value)
                )
              }
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />

            <p className="mt-2 text-xs text-slate-400">
              Each question must have a unique order number.
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push(
              `/admin/quizzes/${quizId}/questions`
            )
          }
          disabled={loading}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check className="h-4 w-4" />

          {loading
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

