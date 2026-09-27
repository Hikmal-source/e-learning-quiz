"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import LessonContent from "./lesson-content";

import {
  Check,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  content: unknown;
  order: number;
}
interface LessonAccordionProps {
  lessons: Lesson[];
  materialSlug: string;
}


export default function LessonAccordion({
  lessons, materialSlug
}: LessonAccordionProps) {
  const [openLesson, setOpenLesson] = useState<string | null>(
    lessons[0]?.id ?? null
  );

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await fetch(
          `/api/materials/${materialSlug}/progress`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load progress"
          );
        }

        setCompletedLessons(
          data.data.completedLessonIds
        );
      } catch (error) {
        console.error("LOAD_PROGRESS_ERROR:", error);
      }
    };

    loadProgress();
  }, [materialSlug]);

  const toggleLesson = (id: string) => {
    setOpenLesson((current) => (current === id ? null : id));
  };

  const completeLesson = async (lessonId: string) => {
    try {
      console.log("LESSON ID:", lessonId);

      const url = `/api/lessons/${lessonId}/complete`;

      console.log("REQUEST URL:", url);

      const response = await fetch(url, {
        method: "POST",
      });

      const data = await response.json();

      console.log("STATUS:", response.status);
      console.log("RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to complete lesson");
      }

      setCompletedLessons((current) =>
        current.includes(lessonId)
          ? current
          : [...current, lessonId]
      );
    } catch (error) {
      console.error("COMPLETE_LESSON_ERROR:", error);
    }
  };
  const completedCount = completedLessons.length;

  const progress =
    lessons.length > 0
      ? Math.round((completedCount / lessons.length) * 100)
      : 0;

  return (
    <div>
      {/* Progress */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Your Progress
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {completedCount} of {lessons.length} lessons completed
            </p>
          </div>

          <span className="text-sm font-bold text-emerald-600">
            {progress}%
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
          />
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        {lessons.map((lesson) => {
          const isOpen = openLesson === lesson.id;
          const isCompleted = completedLessons.includes(lesson.id);

          return (
            <div
              key={lesson.id}
              className={`overflow-hidden rounded-2xl border bg-white transition ${isCompleted
                ? "border-emerald-200"
                : "border-slate-200"
                }`}
            >
              <button
                type="button"
                onClick={() => toggleLesson(lesson.id)}
                className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${isCompleted
                    ? "bg-emerald-500 text-white"
                    : "bg-emerald-50 text-emerald-600"
                    }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    lesson.order
                  )}
                </div>

                <span
                  className={`flex-1 font-semibold ${isCompleted
                    ? "text-slate-500 line-through"
                    : "text-slate-900"
                    }`}
                >
                  {lesson.title}
                </span>

                <motion.div
                  animate={{
                    rotate: isOpen ? 180 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="border-t border-slate-100 px-5 pb-6 pt-5 pl-18">
                      <div className="text-sm leading-7 text-slate-600">
                        <LessonContent content={lesson.content} />
                      </div>

                      <button
                        type="button"
                        onClick={() => completeLesson(lesson.id)}
                        disabled={isCompleted}
                        className={`mb-6 mt-7 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${isCompleted
                          ? "cursor-default bg-slate-100 text-slate-600"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                          }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            Mark as Complete
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}