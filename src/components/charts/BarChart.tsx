"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BarChartProps {
  data: Array<{ month: string; income: number; expense: number }>;
}

export function BarChartComponent({ data }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsBarChart data={data} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F4C0D1" opacity={0.3} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#444441", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#444441", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid rgba(244, 192, 209, 0.3)",
            borderRadius: "1rem",
            fontSize: 13,
          }}
          formatter={(value: number) => [`฿${value.toLocaleString()}`, ""]}
        />
        <Legend
          wrapperStyle={{ fontSize: 12 }}
          formatter={(value: string) => (value === "income" ? "รายรับ" : "รายจ่าย")}
        />
        <Bar dataKey="income" fill="#9FE1CB" radius={[8, 8, 0, 0]} />
        <Bar dataKey="expense" fill="#F4C0D1" radius={[8, 8, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
