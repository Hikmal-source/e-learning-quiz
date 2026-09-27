"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Clock3,
  Crown,
  Medal,
  Trophy,
  Users,
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

export default function AdminLeaderboardPage() {
  const [data, setData] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [selectedQuizId, setSelectedQuizId] = useState("");

  async function fetchLeaderboard() {
    try {
      setError("");

      const response = await fetch("/api/leaderboard", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load leaderboard."
        );
      }

      setData(result.data ?? []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("ADMIN_LEADERBOARD_ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load leaderboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaderboard();

    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 5000);

    return () => clearInterval(interval);
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
    if (!selectedQuizId && quizzes.length > 0) {
      setSelectedQuizId(quizzes[0].id);
    }
  }, [quizzes, selectedQuizId]);

  /*
   * Semua attempt dari quiz yang sedang dipilih
   */
  const selectedQuizAttempts = useMemo(() => {
    if (!selectedQuizId) {
      return [];
    }

    return data.filter(
      (item) => item.quiz.id === selectedQuizId
    );
  }, [data, selectedQuizId]);

  /*
   * Ranking:
   * 1 user = 1 ranking
   *
   * Jika user mengerjakan quiz yang sama berkali-kali:
   * - score terbesar dipilih
   * - jika score sama, durasi tercepat dipilih
   */
  const ranking = useMemo<RankedParticipant[]>(() => {
    const bestByUser = new Map<string, LeaderboardItem>();

    for (const item of selectedQuizAttempts) {
      const existing = bestByUser.get(item.user.id);

      if (!existing) {
        bestByUser.set(item.user.id, item);
        continue;
      }

      const isBetterScore = item.score > existing.score;

      const isSameScoreButFaster =
        item.score === existing.score &&
        item.duration < existing.duration;

      if (isBetterScore || isSameScoreButFaster) {
        bestByUser.set(item.user.id, item);
      }
    }

    const sorted = Array.from(bestByUser.values()).sort(
      (a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return a.duration - b.duration;
      }
    );

    return sorted.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [selectedQuizAttempts]);

  const topThree = ranking.slice(0, 3);
  const remaining = ranking.slice(3);

  const averageScore = useMemo(() => {
    if (ranking.length === 0) {
      return 0;
    }

    const total = ranking.reduce(
      (sum, item) => sum + item.score,
      0
    );

    return Math.round(total / ranking.length);
  }, [ranking]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds
      .toString()
      .padStart(2, "0")}s`;
  };

  const getInitial = (name: string | null) => {
    return (name ?? "U").charAt(0).toUpperCase();
  };

  const selectedQuizTitle =
    quizzes.find(
      (quiz) => quiz.id === selectedQuizId
    )?.title ?? "Quiz";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8 lg:py-10">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <Trophy className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Leaderboard
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor participant performance by quiz.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live */}
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>

              <span className="text-xs font-semibold text-emerald-700">
                Live
              </span>
            </div>

            {lastUpdated && (
              <span className="text-xs text-slate-400">
                Updated{" "}
                {lastUpdated.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              Loading leaderboard...
            </p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Trophy className="mx-auto h-10 w-10 text-slate-300" />

            <h2 className="mt-4 text-base font-semibold text-slate-900">
              No completed quizzes yet
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Completed quiz attempts will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Quiz Selector */}
            <section className="mb-8">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Selected Quiz
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      {selectedQuizTitle}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Ranking dihitung hanya dari quiz yang dipilih.
                    </p>
                  </div>

                  <select
                    value={selectedQuizId}
                    onChange={(event) =>
                      setSelectedQuizId(event.target.value)
                    }
                    className="h-11 min-w-64 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    {quizzes.map((quiz) => (
                      <option
                        key={quiz.id}
                        value={quiz.id}
                      >
                        {quiz.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Participants
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {ranking.length}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Users className="h-5 w-5 text-slate-500" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Average Score
                    </p>

                    <p className="mt-2 text-2xl font-bold text-emerald-600">
                      {averageScore}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                    <Activity className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Completed Attempts
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {selectedQuizAttempts.length}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <Trophy className="h-5 w-5 text-slate-500" />
                  </div>
                </div>
              </div>
            </div>

            {ranking.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <Trophy className="mx-auto h-10 w-10 text-slate-300" />

                <h2 className="mt-4 text-base font-semibold text-slate-900">
                  No participants yet
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Belum ada peserta yang menyelesaikan quiz ini.
                </p>
              </div>
            ) : (
              <>
                {/* Top 3 */}
                <section className="mb-8">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Top Performers
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Peserta dengan skor terbaik pada quiz ini.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {topThree.map((item) => {
                      const isFirst = item.rank === 1;
                      const isSecond = item.rank === 2;

                      return (
                        <div
                          key={item.user.id}
                          className={`relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition duration-300 ${isFirst
                              ? "border-amber-200"
                              : "border-slate-200"
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${isFirst
                                  ? "bg-amber-50"
                                  : isSecond
                                    ? "bg-slate-100"
                                    : "bg-orange-50"
                                }`}
                            >
                              {isFirst ? (
                                <Crown className="h-5 w-5 text-amber-500" />
                              ) : (
                                <Medal
                                  className={`h-5 w-5 ${isSecond
                                      ? "text-slate-500"
                                      : "text-orange-500"
                                    }`}
                                />
                              )}
                            </div>

                            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                              #{item.rank}
                            </span>
                          </div>

                          <div className="mt-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                              {getInitial(item.user.name)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {item.user.name ??
                                  "Unknown User"}
                              </p>

                              <p className="truncate text-xs text-slate-400">
                                {item.quiz.title}
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 flex items-end justify-between">
                            <div>
                              <p className="text-xs font-medium text-slate-400">
                                Score
                              </p>

                              <p className="mt-1 text-3xl font-bold text-emerald-600">
                                {item.score}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Clock3 className="h-3.5 w-3.5" />

                              {formatDuration(
                                item.duration
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Ranking */}
                <section className="mb-8">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Ranking
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Setiap peserta hanya muncul satu kali.
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="hidden grid-cols-[70px_1fr_200px_100px_120px] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                      <span>Rank</span>
                      <span>Participant</span>
                      <span>Quiz</span>
                      <span>Score</span>
                      <span>Time</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {ranking.map((item) => (
                        <div
                          key={item.user.id}
                          className="grid gap-4 px-5 py-4 transition duration-300 hover:bg-slate-50 md:grid-cols-[70px_1fr_200px_100px_120px] md:items-center md:px-6"
                        >
                          <div>
                            <span className="text-sm font-bold text-slate-500">
                              #{item.rank}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                              {getInitial(item.user.name)}
                            </div>

                            <p className="truncate text-sm font-semibold text-slate-900">
                              {item.user.name ??
                                "Unknown User"}
                            </p>
                          </div>

                          <p className="truncate text-sm text-slate-600">
                            {item.quiz.title}
                          </p>

                          <p className="text-sm font-bold text-emerald-600">
                            {item.score}
                          </p>

                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock3 className="h-4 w-4" />

                            {formatDuration(
                              item.duration
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Score Chart */}
                <section>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Score Performance
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Perbandingan skor peserta pada quiz yang dipilih.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex h-64 items-end gap-3 overflow-x-auto pb-8">
                      {ranking.map((item) => {
                        const height = Math.max(
                          8,
                          Math.min(item.score, 100)
                        );

                        return (
                          <div
                            key={item.user.id}
                            className="group flex h-full min-w-12 flex-1 flex-col items-center justify-end"
                          >
                            <div className="mb-2 text-xs font-semibold text-slate-500 opacity-0 transition group-hover:opacity-100">
                              {item.score}
                            </div>

                            <div
                              className="w-full max-w-12 rounded-t-xl bg-emerald-500 transition-all duration-700 ease-out group-hover:bg-emerald-600"
                              style={{
                                height: `${height}%`,
                              }}
                            />

                            <div className="mt-3 w-full truncate text-center text-[10px] font-medium text-slate-400">
                              {item.user.name ?? "User"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}