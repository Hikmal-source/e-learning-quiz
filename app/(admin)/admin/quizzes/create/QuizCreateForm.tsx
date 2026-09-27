
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QuizCreateForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("30");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const durationNumber = Number(duration);

    if (!Number.isInteger(durationNumber) || durationNumber < 1) {
      setError("Duration must be a valid positive number.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: description || undefined,
          duration: durationNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ?? "Failed to create quiz."
        );
        return;
      }

      router.push("/admin/quizzes");
      router.refresh();
    } catch (error) {
      console.error("CREATE_QUIZ_ERROR:", error);

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
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
    >
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Quiz Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="e.g. Linux Fundamental"
            maxLength={200}
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />

          <p className="mt-2 text-xs text-slate-400">
            Give your quiz a clear and descriptive title.
          </p>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-slate-800"
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
            maxLength={500}
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />

          <p className="mt-2 text-xs text-slate-400">
            Maximum 500 characters.
          </p>
        </div>

        {/* Duration */}
        <div>
          <label
            htmlFor="duration"
            className="mb-2 block text-sm font-semibold text-slate-800"
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
                setDuration(event.target.value)
              }
              required
              className="w-32 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />

            <span className="text-sm text-slate-500">
              minutes
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Quiz duration must be between 1 and 180 minutes.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/admin/quizzes")}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Quiz"}
          </button>
        </div>
      </div>
    </form>
  );
}

