"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ResourceData = {
  name: string;
  value: number;
};

type Props = {
  data: ResourceData[];
};

export default function AdminResourceChart({
  data,
}: Props) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -10,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#64748b",
              fontSize: 12,
            }}
          />

          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#94a3b8",
              fontSize: 12,
            }}
          />

          <Tooltip
            cursor={{
              fill: "#f8fafc",
            }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 8px 24px rgba(15, 23, 42, 0.08)",
            }}
          />

          <Bar
            dataKey="value"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 