import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { getQuizById } from "@/libs/service/quiz-admin.service";
import QuizEditForm from "@/app/(admin)/admin/quizzes/[id]/edit/QuizEditForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function QuizEditPage({
  params,
}: PageProps) {
  const { id } = await params;

  const quiz = await getQuizById(id);

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

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-6 py-8 lg:px-8 lg:py-10">
        <Link
          href="/admin/quizzes"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Edit Quiz
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Update the quiz information and settings.
          </p>
        </div>

        <QuizEditForm quiz={quiz} />
      </div>
    </main>
  );
}