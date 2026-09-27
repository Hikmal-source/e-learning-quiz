
import Link from "next/link";
import {
  Clock,
  FileQuestion,
  Pencil,
  Plus,
  Settings2,
} from "lucide-react";

import { getQuizzes } from "@/libs/service/quiz-admin.service";
import DeleteQuizButton from "@/app/(admin)/admin/quizzes/DeleteQuestionPage";

export default async function AdminQuizzesPage() {
  const quizzes = await getQuizzes();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-500">
              Administration
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Quiz Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Create and manage quizzes, questions, duration, and publication
              status.
            </p>
          </div>

          <Link
            href="/admin/quizzes/create"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition "
          >
            <Plus className="h-4 w-4" />
            Create Quiz
          </Link>
        </div>

        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Quizzes
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {quizzes.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Published
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {quizzes.filter((quiz) => quiz.isPublished).length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Draft
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {quizzes.filter((quiz) => !quiz.isPublished).length}
            </p>
          </div>
        </div>

        {/* Quiz List */}
        {quizzes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100">
              <FileQuestion className="h-7 w-7 text-slate-500" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              No quizzes yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't created any quizzes yet. Start by creating your
              first quiz.
            </p>

            <Link
              href="/admin/quizzes/create"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition "
            >
              <Plus className="h-4 w-4" />
              Create Quiz
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <article
                key={quiz.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300"
              >
                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                  {/* Quiz information */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {quiz.title}
                      </h2>

                      <span
                        className={
                          quiz.isPublished
                            ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                            : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                        }
                      >
                        {quiz.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    {quiz.description ? (
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                        {quiz.description}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm italic text-slate-400">
                        No description provided.
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                          <FileQuestion className="h-4 w-4 text-slate-600" />
                        </span>

                        <span>
                          <strong className="font-semibold text-slate-700">
                            {quiz.questions.length}
                          </strong>{" "}
                          {quiz.questions.length === 1
                            ? "Question"
                            : "Questions"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                          <Clock className="h-4 w-4 text-slate-600" />
                        </span>

                        <span>
                          <strong className="font-semibold text-slate-700">
                            {quiz.duration}
                          </strong>{" "}
                          minutes
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-slate-100 pt-5 xl:border-t-0 xl:pt-0">
                    <Link
                      href={`/admin/quizzes/${quiz.id}/questions`}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Settings2 className="h-4 w-4" />
                      Questions
                    </Link>

                    <Link
                      href={`/admin/quizzes/${quiz.id}/edit`}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                    <DeleteQuizButton
                      quizId={quiz.id}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

