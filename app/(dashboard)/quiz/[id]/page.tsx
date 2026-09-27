import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  FileQuestion,
  Play,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import { getPublishedQuizById } from "@/libs/service/quiz.service";
import { notFound } from "next/navigation";
import StartQuizButton from "@/app/components/quiz/start-quiz-button";

interface QuizDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuizDetailPage({
  params,
}: QuizDetailPageProps) {
  const { id } = await params;

  const quiz = await getPublishedQuizById(id);

  if (!quiz) {
    notFound();
  }

  return (
    <div className="px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back */}
        <Link
          href="/quiz"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Link>

        {/* Hero */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-white px-6 py-10 sm:px-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Trophy className="h-7 w-7" />
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-emerald-600">
                Knowledge Assessment
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {quiz.title}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                {quiz.description ||
                  "Test your knowledge with this quiz."}
              </p>
            </div>

            {/* Stats */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Clock3 className="h-5 w-5 text-slate-600" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Duration
                  </p>
                  <p className="font-semibold text-slate-900">
                    {quiz.duration} minutes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <FileQuestion className="h-5 w-5 text-slate-600" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Questions
                  </p>
                  <p className="font-semibold text-slate-900">
                    {quiz.questions.length} questions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="px-6 py-8 sm:px-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Before you start
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Clock3 className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        Time limited
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        You have {quiz.duration} minutes to
                        complete the quiz.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <FileQuestion className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {quiz.questions.length} questions
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Answer the questions based on your
                        understanding of the material.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <ShieldCheck className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        Your score is calculated securely
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Answers are evaluated on the server
                        after submission.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-500">
                  Ready?
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  Start the quiz
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  The timer starts when you begin.
                </p>

                <StartQuizButton quizId={quiz.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}