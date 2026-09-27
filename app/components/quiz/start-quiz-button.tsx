"use client";

import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { useRouter } from "next/navigation";

interface StartQuizButtonProps {
  quizId: string;
}

export default function StartQuizButton({
  quizId,
}: StartQuizButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/quizzes/${quizId}/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to start quiz"
        );
      }

      router.push(
        `/quiz/${quizId}/take?attemptId=${data.data.attemptId}`
      );
    } catch (error) {
      console.error("START_QUIZ_ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to start quiz"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={handleStart}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Starting...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Start Quiz
          </>
        )}
      </button>

      {error && (
        <p className="mt-3 text-center text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}