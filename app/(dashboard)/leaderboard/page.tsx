"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Clock3,
  Crown,
  Trophy,
} from "lucide-react";

interface LeaderboardItem {
  attemptId: string;
  user: {
    id: string;
    name: string | null;
  };
  quiz: {
    id: string;
    title: string;
  };
  score: number;
  duration: number;
  submittedAt: string;
}

interface RankedParticipant extends LeaderboardItem {
  rank: number;
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/leaderboard",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
            "Failed to load leaderboard"
          );
        }

        setData(result.data ?? []);
      } catch (error) {
        console.error(
          "LEADERBOARD_ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load leaderboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  /*
   * Ambil daftar quiz unik
   */
  const quizzes = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        title: string;
      }
    >();

    for (const item of data) {
      if (!map.has(item.quiz.id)) {
        map.set(item.quiz.id, {
          id: item.quiz.id,
          title: item.quiz.title,
        });
      }
    }

    return Array.from(map.values());
  }, [data]);

  /*
   * Pilih quiz pertama secara otomatis
   */
  useEffect(() => {
    if (
      !selectedQuizId &&
      quizzes.length > 0
    ) {
      setSelectedQuizId(quizzes[0].id);
    }
  }, [quizzes, selectedQuizId]);

  /*
   * Ambil attempt berdasarkan quiz
   */
  const selectedQuizAttempts = useMemo(() => {
    if (!selectedQuizId) {
      return [];
    }

    return data.filter(
      (item) =>
        item.quiz.id === selectedQuizId
    );
  }, [data, selectedQuizId]);

  /*
   * Ranking:
   * 1 peserta = 1 kali
   *
   * Jika peserta mengerjakan quiz
   * beberapa kali:
   * - score terbaik digunakan
   * - jika score sama, waktu tercepat
   */
  const ranking = useMemo<RankedParticipant[]>(
    () => {
      const bestByUser =
        new Map<string, LeaderboardItem>();

      for (const item of selectedQuizAttempts) {
        const existing = bestByUser.get(
          item.user.id
        );

        if (!existing) {
          bestByUser.set(
            item.user.id,
            item
          );
          continue;
        }

        const betterScore =
          item.score > existing.score;

        const sameScoreFaster =
          item.score === existing.score &&
          item.duration < existing.duration;

        if (
          betterScore ||
          sameScoreFaster
        ) {
          bestByUser.set(
            item.user.id,
            item
          );
        }
      }

      const sorted = Array.from(
        bestByUser.values()
      ).sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return a.duration - b.duration;
      });

      return sorted.map(
        (item, index) => ({
          ...item,
          rank: index + 1,
        })
      );
    },
    [selectedQuizAttempts]
  );

  const formatDuration = (
    seconds: number
  ) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remaining = seconds % 60;

    return `${minutes}m ${remaining}s`;
  };

  const selectedQuizTitle =
    quizzes.find(
      (quiz) =>
        quiz.id === selectedQuizId
    )?.title ?? "Quiz";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <Trophy className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Leaderboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                See the top quiz performances.
              </p>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-500">
              Loading leaderboard...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          data.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <Trophy className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-4 text-sm font-medium text-slate-600">
                No completed quizzes yet.
              </p>
            </div>
          )}

        {/* LEADERBOARD */}
        {!loading &&
          !error &&
          data.length > 0 && (
            <>
              {/* QUIZ SELECTOR */}
              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Selected Quiz
                    </p>

                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {selectedQuizTitle}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Each participant appears only once.
                    </p>
                  </div>

                  <select
                    value={selectedQuizId}
                    onChange={(event) =>
                      setSelectedQuizId(
                        event.target.value
                      )
                    }
                    className="h-11 min-w-60 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    {quizzes.map(
                      (quiz) => (
                        <option
                          key={quiz.id}
                          value={quiz.id}
                        >
                          {quiz.title}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {ranking.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                  <Trophy className="mx-auto h-10 w-10 text-slate-300" />

                  <p className="mt-4 text-sm font-medium text-slate-600">
                    No completed attempts for this quiz.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                  {/* TABLE HEADER */}
                  <div className="grid grid-cols-[60px_1fr_180px_100px_120px] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span>Rank</span>
                    <span>Participant</span>
                    <span>Quiz</span>
                    <span>Score</span>
                    <span>Time</span>
                  </div>

                  {/* ROWS */}
                  <div className="divide-y divide-slate-100">
                    {ranking.map(
                      (item) => (
                        <div
                          key={item.user.id}
                          className="grid grid-cols-[60px_1fr_180px_100px_120px] items-center gap-4 px-6 py-5 transition hover:bg-slate-50"
                        >

                          {/* RANK */}
                          <div>
                            {item.rank ===
                              1 ? (
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50">
                                <Crown className="h-4 w-4 text-amber-500" />
                              </div>
                            ) : (
                              <span className="text-sm font-bold text-slate-500">
                                #{item.rank}
                              </span>
                            )}
                          </div>

                          {/* PARTICIPANT */}
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                              {(
                                item.user
                                  .name ??
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {item.user
                                  .name ??
                                  "Unknown User"}
                              </p>
                            </div>
                          </div>

                          {/* QUIZ */}
                          <p className="truncate text-sm font-medium text-slate-600">
                            {item.quiz.title}
                          </p>

                          {/* SCORE */}
                          <p className="text-sm font-bold text-emerald-600">
                            {item.score}
                          </p>

                          {/* TIME */}
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock3 className="h-4 w-4" />

                            {formatDuration(
                              item.duration
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
}