import { notFound, redirect } from "next/navigation";

import { getSession } from "@/libs/auth/session";
import { getPublishedQuizById } from "@/libs/service/quiz.service";
import { prisma } from "@/libs/prisma";
import QuizRunner from "@/app/components/quiz/quiz-runner";

interface QuizTakePageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    attemptId?: string;
  }>;
}

export default async function QuizTakePage({
  params,
  searchParams,
}: QuizTakePageProps) {
  /*
   * ========================================
   * AUTHENTICATION
   * ========================================
   */

  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  /*
   * ========================================
   * PARAMS
   * ========================================
   */

  const { id } = await params;
  const { attemptId } = await searchParams;

  if (!attemptId) {
    redirect(`/quiz/${id}`);
  }

  /*
   * ========================================
   * GET QUIZ
   * ========================================
   */

  const quiz = await getPublishedQuizById(id);

  if (!quiz) {
    notFound();
  }

  /*
   * ========================================
   * GET ATTEMPT
   * ========================================
   *
   * Pastikan attempt:
   *
   * 1. Ada
   * 2. Milik user yang sedang login
   * 3. Berasal dari quiz yang benar
   */

  const attempt = await prisma.quizAttempt.findFirst({
    where: {
      id: attemptId,
      quizId: id,
      userId: session.user.id,
    },
    select: {
      id: true,
      startedAt: true,
      submittedAt: true,
      answers: true
    },
  });

  if (!attempt) {
    redirect(`/quiz/${id}`);
  }

  /*
   * ========================================
   * CHECK SUBMITTED
   * ========================================
   *
   * Kalau attempt sudah selesai,
   * jangan izinkan masuk lagi ke quiz.
   */

  if (attempt.submittedAt) {
    redirect(
      `/quiz/${id}/result?attemptId=${attempt.id}`
    );
  }

  /*
   * ========================================
   * CALCULATE REMAINING TIME
   * ========================================
   *
   * Waktu dihitung berdasarkan startedAt
   * yang tersimpan di database.
   */

  const now = new Date();

  const elapsedSeconds = Math.max(
    0,
    Math.floor(
      (now.getTime() - attempt.startedAt.getTime()) /
      1000
    )
  );

  const totalSeconds = quiz.duration * 60;

  const remainingSeconds = Math.max(
    0,
    totalSeconds - elapsedSeconds
  );

  /*
   * ========================================
   * CHECK EXPIRED
   * ========================================
   *
   * Kalau waktu sudah habis sebelum halaman
   * selesai dibuka, arahkan ke result.
   */

  if (remainingSeconds <= 0) {
    redirect(
      `/quiz/${id}/result?attemptId=${attempt.id}`
    );
  }

  /*
   * ========================================
   * RENDER QUIZ
   * ========================================
   */

  return (
    <QuizRunner
      quiz={{
        id: quiz.id,
        title: quiz.title,
        duration: quiz.duration,
        questions: quiz.questions.map((item) => ({
          id: item.question.id,
          order: item.order,
          question: item.question.question,
          options: item.question.options,
        })),
      }}
      attemptId={attempt.id}
      initialRemainingSeconds={remainingSeconds}
      initialAnswers={(attempt.answers ?? {}) as Record<string, number>}

    />
  );
}