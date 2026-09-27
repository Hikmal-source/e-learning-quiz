"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface QuizPerformance {
  name: string;
  score: number;
}

interface QuizPerformanceChartProps {
  data: QuizPerformance[];
}

export default function QuizPerformanceChart({
  data,
}: QuizPerformanceChartProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Quiz Performance
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Track your quiz scores over time.
        </p>
      </div>

      <div className="mt-6 h-64">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Complete a quiz to see your performance.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                formatter={(value) => [
                  `${value}%`,
                  "Score",
                ]}
              />

              <Area
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.12}
                strokeWidth={2}
                animationBegin={0}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}