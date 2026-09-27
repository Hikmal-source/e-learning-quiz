
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getQuizById } from "@/libs/service/quiz-admin.service";
import { getQuizQuestionById } from "@/libs/service/quiz-question-admin.service";
import QuestionEditForm from "@/app/(admin)/admin/quizzes/[id]/questions/[questionId]/edit/QuestionEditPage";

type PageProps = {
  params: Promise<{
    id: string;
    questionId: string;
  }>;
};

export default async function EditQuestionPage({
  params,
}: PageProps) {
  const { id: quizId, questionId } = await params;

  const quiz = await getQuizById(quizId);
  const quizQuestion = await getQuizQuestionById(questionId);

  if (!quiz || !quizQuestion) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="text-2xl font-bold text-slate-900">
            Question not found
          </h1>

          <Link
            href={`/admin/quizzes/${quizId}/questions`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Questions
          </Link >
        </div >
      </main >
    );
  }

  if (quizQuestion.quizId !== quizId) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="text-2xl font-bold text-slate-900">
            Question not found
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-6 py-8 lg:px-8 lg:py-10">
        <Link
          href={`/admin/quizzes/${quizId}/questions`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Questions
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Edit Question
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Update the position of this question in the quiz.
          </p>
        </div>

        <QuestionEditForm
          quizId={quizId}
          questionId={questionId}
          question={quizQuestion.question.question}
          options={quizQuestion.question.options}
          correctAnswer={quizQuestion.question.correctAnswer}
          explanation={quizQuestion.question.explanation}
          order={quizQuestion.order}
        />
      </div>
    </main>
  );
}

