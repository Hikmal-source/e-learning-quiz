import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Trophy,
} from "lucide-react";

import { getSession } from "@/libs/auth/session";
import { prisma } from "@/libs/prisma";

import LearningProgressChart from "@/app/components/dashboard/learning-progress";
import QuizPerformanceChart from "@/app/components/dashboard/quizz-performance";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  const [
    totalLessons,
    completedLessons,
    completedQuizzes,
    averageScore,
    totalMaterials,
    quizAttempts,
  ] = await Promise.all([
    // Total lessons
    prisma.lesson.count(),

    // Lessons yang sudah diselesaikan user
    prisma.lessonProgress.count({
      where: {
        userId,
        completed: true,
      },
    }),

    // Quiz yang sudah disubmit
    prisma.quizAttempt.count({
      where: {
        userId,
        submittedAt: {
          not: null,
        },
      },
    }),

    // Average score
    prisma.quizAttempt.aggregate({
      where: {
        userId,
        submittedAt: {
          not: null,
        },
      },
      _avg: {
        score: true,
      },
    }),

    // Material yang published
    prisma.material.count({
      where: {
        published: true,
      },
    }),

    // Riwayat quiz untuk chart
    prisma.quizAttempt.findMany({
      where: {
        userId,
        submittedAt: {
          not: null,
        },
      },
      orderBy: {
        submittedAt: "asc",
      },
      select: {
        score: true,
        submittedAt: true,
        quiz: {
          select: {
            title: true,
          },
        },
      },
    }),
  ]);

  const average = Math.round(
    averageScore._avg.score ?? 0
  );

  const quizPerformance = quizAttempts.map(
    (attempt, index) => ({
      name: `Quiz ${index + 1}`,
      score: attempt.score,
    })
  );

  const userName = session.user.name ?? "Learner";

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">

      {/* HEADER */}

      <section>
        <p className="text-sm font-medium text-emerald-600">
          Welcome back 👋
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Hi, {userName}
        </h1>

        <p className="mt-2 text-slate-500">
          Continue your DevOps learning journey.
        </p>
      </section>

      {/* STATS */}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={
            <BookOpen className="h-5 w-5" />
          }
          title="Lessons"
          value={`${completedLessons}/${totalLessons}`}
          description="Lessons completed"
        />

        <StatCard
          icon={
            <CheckCircle2 className="h-5 w-5" />
          }
          title="Quizzes"
          value={`${completedQuizzes}`}
          description="Completed"
        />

        <StatCard
          icon={
            <Trophy className="h-5 w-5" />
          }
          title="Average Score"
          value={`${average}%`}
          description="From completed quizzes"
        />

        <StatCard
          icon={
            <ClipboardCheck className="h-5 w-5" />
          }
          title="Materials"
          value={`${totalMaterials}`}
          description="Available materials"
        />

      </section>

      {/* ANALYTICS */}

      <section className="mt-8 grid gap-6 lg:grid-cols-2">

        <LearningProgressChart
          completed={completedLessons}
          total={totalLessons}
        />

        <QuizPerformanceChart
          data={quizPerformance}
        />

      </section>

      {/* QUICK ACTIONS */}

      <section className="mt-10">

        <h2 className="text-xl font-semibold text-slate-900">
          Quick Actions
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">

          <ActionCard
            href="/materials"
            icon={
              <BookOpen className="h-5 w-5" />
            }
            title="Study Materials"
            description="Explore DevOps learning materials."
          />

          <ActionCard
            href="/quiz"
            icon={
              <ClipboardCheck className="h-5 w-5" />
            }
            title="Take a Quiz"
            description="Test your knowledge with timed quizzes."
          />

          <ActionCard
            href="/leaderboard"
            icon={
              <Trophy className="h-5 w-5" />
            }
            title="Leaderboard"
            description="Check quiz performance and rankings."
          />

        </div>

      </section>

    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
    >

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-5 text-slate-500">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600">
        Open
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>

    </Link>
  );
}