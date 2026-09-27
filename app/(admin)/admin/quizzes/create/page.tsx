
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import QuizCreateForm from "@/app/(admin)/admin/quizzes/create/QuizCreateForm";

export default function CreateQuizPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-6 py-8 lg:px-8 lg:py-10">
        <div className="mb-8">
          <Link
            href="/admin/quizzes"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quizzes
          </Link>

          <p className="mb-2 text-sm font-medium text-slate-500">
            Administration
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Create Quiz
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create a new quiz before adding questions to it.
          </p>
        </div>

        <QuizCreateForm />
      </div>
    </main>
  );
}

