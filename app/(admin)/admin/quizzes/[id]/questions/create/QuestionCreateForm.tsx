"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";

type Props = {
  quizId: string;
};

const optionLabels = ["A", "B", "C", "D", "E", "F"];

export default function QuestionCreateForm({
  quizId,
}: Props) {
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] =
    useState(0);
  const [explanation, setExplanation] =
    useState("");
  const [order, setOrder] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateOption(
    index: number,
    value: string
  ) {
    setOptions((current) =>
      current.map((option, i) =>
        i === index ? value : option
      )
    );
  }

  function addOption() {
    if (options.length >= 6) return;

    setOptions((current) => [
      ...current,
      "",
    ]);
  }

  function removeOption(index: number) {
    if (options.length <= 2) return;

    setOptions((current) =>
      current.filter((_, i) => i !== index)
    );

    if (correctAnswer === index) {
      setCorrectAnswer(0);
    } else if (correctAnswer > index) {
      setCorrectAnswer(
        (current) => current - 1
      );
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/quizzes/${quizId}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            options,
            correctAnswer,
            explanation:
              explanation || undefined,
            order: Number(order),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
          "Failed to save question."
        );
        return;
      }

      router.push(
        `/admin/quizzes/${quizId}/questions`
      );

      router.refresh();
    } catch (error) {
      console.error(
        "CREATE_QUESTION_ERROR:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Question */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600">
              1
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Question
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Write the question that participants
                will answer.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <textarea
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            placeholder="Example: Apa fungsi chmod pada Linux?"
            rows={4}
            required
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>
      </section>

      {/* Options */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600">
                2
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Answer Options
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Add between 2 and 6 answer options.
                </p>
              </div>
            </div>

            <span className="text-xs font-medium text-slate-400">
              {options.length}/6 options
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {options.map((option, index) => (
              <div
                key={index}
                className="group flex items-center gap-3"
              >
                {/* Label */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition ${correctAnswer === index
                    ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-slate-100 text-slate-500"
                    }`}
                >
                  {optionLabels[index]}
                </div>

                {/* Input */}
                <input
                  type="text"
                  value={option}
                  onChange={(event) =>
                    updateOption(
                      index,
                      event.target.value
                    )
                  }
                  placeholder={`Option ${optionLabels[index]}`}
                  required
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />

                {/* Remove */}
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeOption(index)
                    }
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove option ${optionLabels[index]}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50"
            >
              <Plus className="h-4 w-4" />
              Add Option
            </button>
          )}
        </div>
      </section>

      {/* Settings */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Correct Answer */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600">
                3
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Correct Answer
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Select the correct option.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="relative">
              <select
                value={correctAnswer}
                onChange={(event) =>
                  setCorrectAnswer(
                    Number(event.target.value)
                  )
                }
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              >
                {options.map((_, index) => (
                  <option
                    key={index}
                    value={index}
                  >
                    Option {optionLabels[index]}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600">
              <Check className="h-3.5 w-3.5" />
              Correct answer:{" "}
              {optionLabels[correctAnswer]}
            </div>
          </div>
        </div>

        {/* Order */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600">
                4
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Question Order
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Position of this question in the quiz.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <input
              type="number"
              min={1}
              value={order}
              onChange={(event) =>
                setOrder(
                  Number(event.target.value)
                )
              }
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        </div>
      </section>

      {/* Explanation */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600">
              5
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Explanation
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                Explain why the correct answer is correct.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <textarea
            value={explanation}
            onChange={(event) =>
              setExplanation(event.target.value)
            }
            placeholder="Explain why the answer is correct..."
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push(
              `/admin/quizzes/${quizId}/questions`
            )
          }
          disabled={loading}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check className="h-4 w-4" />

          {loading ? "Saving..." : "Save Question"}
        </button>
      </div>
    </form>
  );
}