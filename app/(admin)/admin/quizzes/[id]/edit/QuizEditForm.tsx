"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock,
  FileText,
  Type,
} from "lucide-react";

type Quiz = {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  isPublished: boolean;
};

type Props = {
  quiz: Quiz;
};

export default function QuizEditForm({
  quiz,
}: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(quiz.title);

  const [description, setDescription] = useState(
    quiz.description ?? ""
  );

  const [duration, setDuration] = useState(
    quiz.duration
  );

  const [isPublished, setIsPublished] = useState(
    quiz.isPublished
  );

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
        `/api/admin/quizzes/${quiz.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description:
              description.trim() || undefined,
            duration: Number(duration),
            isPublished,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
          "Failed to update quiz."
        );
        return;
      }

      router.push("/admin/quizzes");
      router.refresh();
    } catch (error) {
      console.error(
        "UPDATE_QUIZ_ERROR:",
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
      {/* Basic Information */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FileText className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Quiz Information
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Update the basic information of this quiz.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Quiz Title
            </label>

            <div className="relative">
              <Type className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Example: Linux Fundamentals"
                required
                maxLength={200}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe what participants will learn or be tested on."
              rows={4}
              maxLength={500}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />

            <p className="mt-2 text-right text-xs text-slate-400">
              {description.length}/500
            </p>
          </div>
        </div>
      </section>

      {/* Duration */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Quiz Duration
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Set how long participants have to complete the quiz.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-sm">
            <label
              htmlFor="duration"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Duration
            </label>

            <div className="flex items-center gap-3">
              <input
                id="duration"
                type="number"
                min={1}
                max={180}
                value={duration}
                onChange={(event) =>
                  setDuration(
                    Number(event.target.value)
                  )
                }
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />

              <span className="shrink-0 text-sm font-medium text-slate-500">
                minutes
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Minimum 1 minute, maximum 180 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Publication Status */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-900">
            Publication Status
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Published quizzes are visible to participants.
          </p>
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    isPublished
                      ? "h-2.5 w-2.5 rounded-full bg-emerald-500"
                      : "h-2.5 w-2.5 rounded-full bg-amber-500"
                  }
                />

                <p className="text-sm font-semibold text-slate-900">
                  {isPublished
                    ? "Published"
                    : "Draft"}
                </p>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {isPublished
                  ? "This quiz is visible to participants."
                  : "This quiz is hidden from participants."}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setIsPublished(
                  (current) => !current
                )
              }
              disabled={loading}
              className={
                isPublished
                  ? "rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                  : "rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              }
            >
              {isPublished
                ? "Unpublish"
                : "Publish Quiz"}
            </button>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push("/admin/quizzes")
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