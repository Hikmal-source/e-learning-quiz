import Link from "next/link";

import {
  ArrowLeft,
  Clock,
  FileQuestion,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { getQuizById } from "@/libs/service/quiz-admin.service";
import { getQuizQuestions } from "@/libs/service/quiz-question-admin.service";
import DeleteQuestionButton from "@/app/(admin)/admin/quizzes/[id]/questions/DeleteQuestionButton";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function QuizQuestionsPage({
  params,
}: PageProps) {
  const { id: quizId } = await params;

  const quiz = await getQuizById(quizId);

  if (!quiz) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-2xl font-bold text-slate-900">
            Quiz not found
          </h1>
        </div>
      </main>
    );
  }

  const questions = await getQuizQuestions(quizId);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        {/* Back */}
        <Link
          href="/admin/quizzes"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Link>

        {/* Quiz Header */}
        <div className="mb-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {quiz.title}
                </h1>

                <span
                  className={
                    quiz.isPublished
                      ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                      : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                  }
                >
                  {quiz.isPublished
                    ? "Published"
                    : "Draft"}
                </span>
              </div>

              {quiz.description && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  {quiz.description}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <FileQuestion className="h-4 w-4" />
                  {questions.length} Questions
                </span>

                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {quiz.duration} minutes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <section>
          {/* Section Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Quiz Questions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage the questions included in this quiz.
              </p>
            </div>

            <Link
              href={`/admin/quizzes/${quizId}/questions/create`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Link>
          </div>

          {/* Empty State */}
          {questions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <FileQuestion className="h-8 w-8 text-slate-500" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                No questions yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Start building this quiz by creating your
                first question.
              </p>

              <Link
                href={`/admin/quizzes/${quizId}/questions/create`}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
                Create First Question
              </Link>
            </div>
          ) : (
            /* Question List */
            <div className="space-y-4">
              {questions.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300"
                >
                  {/* Question Header */}
                  <div className="flex items-start gap-4">
                    {/* Question Number */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                      {item.order}
                    </div>

                    {/* Question Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <h3 className="text-base font-semibold leading-6 text-slate-900">
                          {item.question.question}
                        </h3>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                          <Link
                            href={`/admin/quizzes/${quizId}/questions/${item.id}/edit`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                            aria-label={`Edit question ${item.order}`}
                            title="Edit question"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <DeleteQuestionButton
                            quizId={quizId}
                            questionId={item.id}
                          />
                        </div>
                      </div>

                      {/* Options */}
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {item.question.options.map(
                          (option, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                            >
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-500 shadow-sm">
                                {String.fromCharCode(
                                  65 + index
                                )}
                              </span>

                              <span className="pt-1 text-sm leading-5 text-slate-600">
                                {option}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}