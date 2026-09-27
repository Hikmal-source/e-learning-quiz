
"use client";

import { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  order: number;
  question: string;
  options: string[];
}

interface Quiz {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
}

interface QuizRunnerProps {
  quiz: Quiz;
  attemptId: string;
  initialRemainingSeconds: number;
  initialAnswers: Record<string, number>;
}

export default function QuizRunner({
  quiz,
  attemptId,
  initialRemainingSeconds,
  initialAnswers,
}: QuizRunnerProps) {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] =
    useState<Record<string, number>>(initialAnswers);

  const [remainingSeconds, setRemainingSeconds] =
    useState(initialRemainingSeconds);

  const [submitting, setSubmitting] = useState(false);

  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState(true);

  const [error, setError] = useState("");

  const [validationError, setValidationError] =
    useState("");

  const currentQuestion = quiz.questions[currentIndex];

  const answeredCount = Object.keys(answers).length;

  const isLastQuestion =
    currentIndex === quiz.questions.length - 1;

  const hasCurrentAnswer =
    currentQuestion &&
    answers[currentQuestion.id] !== undefined;

  const progress = useMemo(() => {
    if (quiz.questions.length === 0) {
      return 0;
    }

    return (
      ((currentIndex + 1) / quiz.questions.length) * 100
    );
  }, [currentIndex, quiz.questions.length]);

  /*
   * ========================================
   * TIMER
   * ========================================
   */

  useEffect(() => {
    if (submitting) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [submitting]);

  /*
   * ========================================
   * AUTO SUBMIT
   * ========================================
   */

  useEffect(() => {
    if (remainingSeconds === 0 && !submitting) {
      handleSubmit();
    }
  }, [remainingSeconds]);

  /*
   * ========================================
   * FORMAT TIMER
   * ========================================
   */

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remaining).padStart(2, "0")}`;
  };

  /*
   * ========================================
   * SAVE ANSWERS
   * ========================================
   */

  const saveAnswers = async (
    updatedAnswers: Record<string, number>
  ) => {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const response = await fetch(
        `/api/quizzes/${quiz.id}/attempt/${attemptId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: updatedAnswers,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save answers"
        );
      }

      setSaved(true);
    } catch (error) {
      console.error(
        "SAVE_ANSWERS_ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save answers"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ========================================
   * SELECT ANSWER
   * ========================================
   */

  const handleAnswer = (optionIndex: number) => {
    if (submitting || !currentQuestion) {
      return;
    }

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: optionIndex,
    };

    setAnswers(updatedAnswers);

    setValidationError("");
    setError("");

    saveAnswers(updatedAnswers);
  };

  /*
   * ========================================
   * NEXT QUESTION
   * ========================================
   */

  const handleNext = () => {
    if (submitting || !currentQuestion) {
      return;
    }

    const hasAnswer =
      answers[currentQuestion.id] !== undefined;

    if (!hasAnswer) {
      setValidationError(
        "Please select an answer before continuing."
      );

      return;
    }

    setValidationError("");
    setError("");

    setCurrentIndex((previous) =>
      Math.min(
        previous + 1,
        quiz.questions.length - 1
      )
    );
  };

  /*
   * ========================================
   * PREVIOUS QUESTION
   * ========================================
   */

  const handlePrevious = () => {
    if (submitting) {
      return;
    }

    setValidationError("");
    setError("");

    setCurrentIndex((previous) =>
      Math.max(previous - 1, 0)
    );
  };

  /*
   * ========================================
   * SUBMIT QUIZ
   * ========================================
   */

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    /*
     * Jika waktu masih tersedia,
     * semua soal harus sudah dijawab.
     *
     * Jika waktu habis, submission tetap
     * diperbolehkan dengan jawaban yang sudah ada.
     */

    if (remainingSeconds > 0) {
      const unansweredQuestion = quiz.questions.find(
        (question) =>
          answers[question.id] === undefined
      );

      if (unansweredQuestion) {
        setValidationError(
          `Please answer question ${unansweredQuestion.order} before submitting.`
        );

        return;
      }
    }

    try {
      setSubmitting(true);

      setError("");
      setValidationError("");

      const response = await fetch(
        `/api/quizzes/${quiz.id}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attemptId,
            answers,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit quiz"
        );
      }

      router.replace(
        `/quiz/${quiz.id}/result?attemptId=${attemptId}`
      );
    } catch (error) {
      console.error(
        "SUBMIT_QUIZ_ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to submit quiz"
      );

      setSubmitting(false);
    }
  };

  /*
   * ========================================
   * NO QUESTION
   * ========================================
   */

  if (!currentQuestion) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">
          No questions available.
        </p>
      </div>
    );
  }

  /*
   * ========================================
   * UI
   * ========================================
   */

  return (
    <div
      className="min-h-[calc(100vh-4rem)] select-none bg-slate-50 px-6 py-8 lg:px-8"
      onCopy={(event) => event.preventDefault()}
      onCut={(event) => event.preventDefault()}
      onPaste={(event) => event.preventDefault()}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600">
              Quiz
            </p>

            <h1 className="mt-1 text-xl font-bold text-slate-900">
              {quiz.title}
            </h1>
          </div>

          {/* TIMER */}

          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold ${remainingSeconds <= 60
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-slate-200 bg-white text-slate-700"
              }`}
          >
            <Clock3 className="h-4 w-4" />

            {formatTime(remainingSeconds)}
          </div>
        </div>

        {/* PROGRESS */}

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>
              Question {currentIndex + 1} of{" "}
              {quiz.questions.length}
            </span>

            <span>
              {answeredCount}/
              {quiz.questions.length} answered
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* QUESTION CARD */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          {/* QUESTION */}

          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">
              {currentQuestion.order}
            </div>

            <h2 className="text-lg font-bold leading-7 text-slate-900">
              {currentQuestion.question}
            </h2>
          </div>

          {/* OPTIONS */}

          <div className="mt-8 space-y-3">
            {currentQuestion.options.map(
              (option, optionIndex) => {
                const selected =
                  answers[currentQuestion.id] ===
                  optionIndex;

                return (
                  <button
                    key={optionIndex}
                    type="button"
                    disabled={submitting}
                    onClick={() =>
                      handleAnswer(optionIndex)
                    }
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${selected
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"
                      } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    {/* OPTION LETTER */}

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${selected
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-600"
                        }`}
                    >
                      {String.fromCharCode(
                        65 + optionIndex
                      )}
                    </span>

                    {/* OPTION TEXT */}

                    <span
                      className={`text-sm font-medium ${selected
                          ? "text-emerald-900"
                          : "text-slate-700"
                        }`}
                    >
                      {option}
                    </span>

                    {/* SELECTED */}

                    {selected && (
                      <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-emerald-600" />
                    )}
                  </button>
                );
              }
            )}
          </div>

          {/* SAVE STATUS */}

          <div className="mt-4 flex justify-end">
            {saving ? (
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </div>
            ) : saved ? (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Saved
              </div>
            ) : null}
          </div>

          {/* VALIDATION ERROR */}

          {validationError && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <p className="text-sm font-medium text-amber-700">
                {validationError}
              </p>
            </div>
          )}

          {/* API ERROR */}

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* NAVIGATION */}

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">

            {/* PREVIOUS */}

            <button
              type="button"
              disabled={
                currentIndex === 0 || submitting
              }
              onClick={handlePrevious}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {/* NEXT / SUBMIT */}

            {isLastQuestion ? (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />

                {submitting
                  ? "Submitting..."
                  : "Submit Quiz"}
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* CURRENT ANSWER STATUS */}

          <div className="mt-5 text-center">
            {hasCurrentAnswer ? (
              <p className="text-xs font-medium text-emerald-600">
                Answer selected
              </p>
            ) : (
              <p className="text-xs font-medium text-slate-400">
                Please select an answer to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
