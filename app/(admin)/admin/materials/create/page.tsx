
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Save,
  Terminal,
} from "lucide-react";

export default function CreateMaterialPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("GENERAL");
  const [published, setPublished] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          description,
          category,
          type,
          published,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ?? "Failed to create material."
        );
        return;
      }

      router.push("/admin/materials");
      router.refresh();
    } catch (error) {
      console.error("CREATE MATERIAL ERROR:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8">
        <Link
          href="/admin/materials"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Materials
        </Link>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
          Create Material
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Create a new learning material for participants.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Title
          </label>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Linux Fundamentals"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Slug
          </label>

          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="linux-fundamentals"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            required
          />

          <p className="mt-2 text-xs text-slate-400">
            Used for the material URL.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Learn Linux fundamentals for DevOps and system administration."
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>

          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Linux"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            required
          />
        </div>

        {/* Material Type */}
        <div>
          <label className="mb-3 block text-sm font-medium text-slate-700">
            Material Type
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* General */}
            <button
              type="button"
              onClick={() => setType("GENERAL")}
              className={`rounded-2xl border p-4 text-left transition ${type === "GENERAL"
                  ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  <BookOpen className="h-5 w-5 text-slate-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    General
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Standard learning material
                  </p>
                </div>
              </div>
            </button>

            {/* Linux Command */}
            <button
              type="button"
              onClick={() => setType("LINUX_COMMAND")}
              className={`rounded-2xl border p-4 text-left transition ${type === "LINUX_COMMAND"
                  ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 font-mono text-sm text-emerald-400">
                  <Terminal className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Linux Command
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Terminal-based learning material
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Publish */}
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) =>
              setPublished(event.target.checked)
            }
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />

          <div>
            <p className="text-sm font-medium text-slate-800">
              Publish material
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Participants can access this material immediately.
            </p>
          </div>
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
          <Link
            href="/admin/materials"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />

            {loading ? "Creating..." : "Create Material"}
          </button>
        </div>
      </form>
    </div>
  );
}

