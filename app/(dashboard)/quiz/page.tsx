"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  FileQuestion,
  Loader2,
  Trophy,
} from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  questionCount: number;
  createdAt: string;
}

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const response = await fetch("/api/quizzes");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load quizzes"
          );
        }

        setQuizzes(data.data);
      } catch (error) {
        console.error("LOAD_QUIZZES_ERROR:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load quizzes"
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  return (
    <div className="px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-600">
            <Trophy className="h-4 w-4" />
            Quiz
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Test Your Knowledge
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Challenge yourself with quizzes and measure your
            understanding of the topics you have learned.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading quizzes...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-semibold text-red-700">
              Failed to load quizzes
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && quizzes.length === 0 && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BookOpen className="h-6 w-6" />
            </div>

            <h2 className="mt-4 font-semibold text-slate-900">
              No quizzes available
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              There are no published quizzes available right now.
            </p>
          </div>
        )}

        {/* Quiz Grid */}
        {!loading && !error && quizzes.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-sm"
              >
                {/* Icon */}
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <FileQuestion className="h-5 w-5" />
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Quiz
                  </span>
                </div>

                {/* Content */}
                <div className="mt-5 flex-1">
                  <h2 className="text-lg font-bold text-slate-900">
                    {quiz.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                    {quiz.description ||
                      "Test your knowledge with this quiz."}
                  </p>
                </div>

                {/* Meta */}
                <div className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Clock3 className="h-4 w-4" />
                    {quiz.duration} min
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <FileQuestion className="h-4 w-4" />
                    {quiz.questionCount} questions
                  </div>
                </div>

                {/* Action */}
                <Link
                  href={`/quiz/${quiz.id}`}
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  View Quiz
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}