import Link from "next/link";

import QuestionCreateForm from "@/app/(admin)/admin/quizzes/[id]/questions/create/QuestionCreateForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CreateQuestionPage({
  params,
}: PageProps) {
  const { id: quizId } = await params;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href={`/admin/quizzes/${quizId}/questions`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Questions
        </Link>

        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Add Question
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create a new question for this quiz.
          </p>
        </div>
      </div>

      <QuestionCreateForm quizId={quizId} />
    </div>
  );
}