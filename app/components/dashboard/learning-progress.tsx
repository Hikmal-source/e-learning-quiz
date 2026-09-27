"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface LearningProgressChartProps {
  completed: number;
  total: number;
}

export default function LearningProgressChart({
  completed,
  total,
}: LearningProgressChartProps) {
  const remaining = Math.max(total - completed, 0);

  const data = [
    {
      name: "Completed",
      value: completed,
    },
    {
      name: "Remaining",
      value: remaining,
    },
  ];

  const progress =
    total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Learning Progress
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your overall lesson progress.
        </p>
      </div>

      <div className="relative mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={100}
              paddingAngle={3}
              startAngle={90}
              endAngle={-270}
              animationBegin={0}
              animationDuration={1000}
              stroke="none"
            >
              <Cell fill="#10b981" />
              <Cell fill="#e2e8f0" />
            </Pie>

            <Tooltip
              formatter={(value) => [
                `${value} lessons`,
                "Progress",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900">
            {progress}%
          </span>

          <span className="mt-1 text-xs text-slate-400">
            {completed}/{total} lessons
          </span>
        </div>
      </div>
    </div>
  );
}