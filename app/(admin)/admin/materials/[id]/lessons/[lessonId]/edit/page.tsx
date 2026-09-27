"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import LessonEditor from "@/app/components/admin/lesson-editor";

type LessonContent = Record<string, unknown>;

export default function EditLessonPage() {
  const params = useParams();
  const router = useRouter();

  const materialId = params.id as string;
  const lessonId = params.lessonId as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<LessonContent>({
    type: "doc",
    content: [{ type: "paragraph" }],
  });
  const [order, setOrder] = useState("1");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLesson() {
      try {
        const response = await fetch(
          `/api/admin/lessons/${lessonId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ?? "Failed to load lesson."
          );
        }

        setTitle(data.title);
        setOrder(String(data.order));

        // Support legacy string content
        if (typeof data.content === "string") {
          setContent({
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: data.content,
                  },
                ],
              },
            ],
          });
        } else {
          setContent(data.content);
        }
      } catch (error) {
        console.error("LOAD_LESSON_ERROR:", error);
        setError("Failed to load lesson.");
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [lessonId]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    const orderNumber = Number(order);

    if (!Number.isInteger(orderNumber) || orderNumber < 1) {
      setError("Order must be a positive integer.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/lessons/${lessonId}`,
        {
          method: "PATCH",
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

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ?? "Failed to update lesson."
        );
        return;
      }

      router.push(
        `/admin/materials/${materialId}/lessons`
      );
      router.refresh();
    } catch (error) {
      console.error("UPDATE_LESSON_ERROR:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-8">
        <p className="text-sm text-slate-500">
          Loading lesson...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <Link
          href={`/admin/materials/${materialId}/lessons`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lessons
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-950">
          Edit Lesson
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update lesson content and ordering.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-[1fr_140px]">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Lesson Title
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                placeholder="Introduction to Linux"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Order
              </label>

              <input
                type="number"
                min="1"
                value={order}
                onChange={(event) =>
                  setOrder(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Lesson Content
            </h2>
          </div>

          <LessonEditor
            content={content}
            onChange={setContent}
          />
        </div>

        <div className="relative z-10 flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}