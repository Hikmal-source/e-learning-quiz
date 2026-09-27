"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import LessonEditor from "@/app/components/admin/lesson-editor";

type LessonContent = Record<string, unknown>;

export default function CreateLessonPage() {
  const params = useParams();
  const router = useRouter();

  const materialId = params.id as string;

  const [title, setTitle] = useState("");

  const [content, setContent] =
    useState<LessonContent>({
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    });

  const [order, setOrder] = useState("1");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (
      !content ||
      !Array.isArray(content.content) ||
      content.content.length === 0
    ) {
      setError("Content is required.");
      return;
    }

    const orderNumber = Number(order);

    if (
      !Number.isInteger(orderNumber) ||
      orderNumber < 1
    ) {
      setError(
        "Order must be a positive integer."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/materials/${materialId}/lessons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            content,
            order: orderNumber,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ??
          "Failed to create lesson."
        );
        return;
      }

      router.push(
        `/admin/materials/${materialId}/lessons`
      );

      router.refresh();
    } catch (error) {
      console.error(
        "CREATE_LESSON_ERROR:",
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
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/admin/materials/${materialId}/lessons`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lessons
        </Link>

        <p className="text-sm font-medium text-emerald-600">
          Content Management
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Create Lesson
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Add a new lesson to this learning material.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="space-y-6 p-6">
          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Lesson Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="e.g. Basic Linux Commands"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Order */}
          <div className="max-w-xs">
            <label
              htmlFor="order"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Lesson Order
            </label>

            <input
              id="order"
              type="number"
              min="1"
              value={order}
              onChange={(event) =>
                setOrder(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

            <p className="mt-2 text-xs text-slate-400">
              Determines the position of this lesson
              inside the material.
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Lesson Content
            </label>

            <LessonEditor
              content={content}
              onChange={setContent}
            />

            <p className="mt-2 text-xs text-slate-400">
              Use the editor toolbar to format text,
              headings, lists, quotes, inline code,
              and code blocks.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <Link
            href={`/admin/materials/${materialId}/lessons`}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />

            {loading
              ? "Creating..."
              : "Create Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
}