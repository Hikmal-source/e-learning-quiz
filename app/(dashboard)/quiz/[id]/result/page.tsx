"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Home,
  RotateCcw,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

interface QuizResult {
  attemptId: string;
  quizId: string;
  title: string;
  description: string | null;
  score: number;
  duration: number;
  totalQuestions: number;
  submittedAt: string | null;
}

export default function QuizResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const quizId = params.id as string;
  const attemptId =
    searchParams.get("attemptId");

  const [result, setResult] =
    useState<QuizResult | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * ========================================
   * FETCH RESULT
   * ========================================
   */

  useEffect(() => {
    if (!quizId || !attemptId) {
      setError("Invalid quiz result URL.");
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/quizzes/${quizId}/result?attemptId=${attemptId}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to load quiz result"
          );
        }

        setResult(data.data);
      } catch (error) {
        console.error(
          "GET_QUIZ_RESULT_ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load quiz result"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [quizId, attemptId]);

  /*
   * ========================================
   * FORMAT DURATION
   * ========================================
   */

  const formattedDuration = useMemo(() => {
    if (!result) {
      return "00:00";
    }

    const minutes = Math.floor(
      result.duration / 60
    );

    const seconds = result.duration % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }, [result]);

  /*
   * ========================================
   * SCORE LABEL
   * ========================================
   */

  const scoreLabel = useMemo(() => {
    if (!result) {
      return "";
    }

    if (result.score >= 80) {
      return "Excellent work!";
    }

    if (result.score >= 60) {
      return "Good effort!";
    }

    return "Keep practicing!";
  }, [result]);

  /*
   * ========================================
   * LOADING
   * ========================================
   */

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="animate-pulse space-y-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-slate-200" />

              <div className="mx-auto h-6 w-48 rounded bg-slate-200" />

              <div className="mx-auto h-4 w-64 rounded bg-slate-200" />

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="h-24 rounded-xl bg-slate-100" />
                <div className="h-24 rounded-xl bg-slate-100" />
                <div className="h-24 rounded-xl bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ========================================
   * ERROR
   * ========================================
   */

  if (error || !result) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <Trophy className="h-7 w-7 text-red-500" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-slate-900">
              Unable to load result
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error ||
                "Quiz result could not be found."}
            </p>

            <Link
              href="/quiz"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Home className="h-4 w-4" />
              Back to Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ========================================
   * RESULT UI
   * ========================================
   */

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <p className="text-sm font-medium text-emerald-600">
            Quiz Completed
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {result.title}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {scoreLabel}
          </p>
        </div>

        {/* Main Result Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Score */}
          <div className="border-b border-slate-100 px-6 py-10 text-center sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <Trophy className="h-10 w-10 text-emerald-600" />
            </div>

            <p className="mt-6 text-sm font-medium text-slate-500">
              Your Score
            </p>

            <div className="mt-2 text-5xl font-black tracking-tight text-emerald-600">
              {result.score}
              <span className="text-2xl">
                /100
              </span>
            </div>

            <div className="mx-auto mt-6 h-3 max-w-md overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${Math.min(
                    Math.max(result.score, 0),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-3">
            {/* Questions */}
            <div className="bg-white p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <p className="mt-3 text-2xl font-bold text-slate-900">
                {result.totalQuestions}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Total Questions
              </p>
            </div>

            {/* Duration */}
            <div className="bg-white p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Clock3 className="h-5 w-5 text-blue-600" />
              </div>

              <p className="mt-3 text-2xl font-bold text-slate-900">
                {formattedDuration}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Time Used
              </p>
            </div>

            {/* Status */}
            <div className="bg-white p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>

              <p className="mt-3 text-2xl font-bold text-slate-900">
                Completed
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Attempt Status
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-slate-100 p-6 sm:p-8">
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Home className="h-4 w-4" />
                Back to Quiz
              </Link>

              <Link
                href={`/quiz/${quizId}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Link>
            </div>
          </div>
        </div>

        {/* Submitted info */}
        {result.submittedAt && (
          <p className="mt-5 text-center text-xs text-slate-400">
            Submitted on{" "}
            {new Date(
              result.submittedAt
            ).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        )}
      </div>
    </div>
  );
}