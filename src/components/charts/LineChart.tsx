"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  data: Array<{ month: string; expense: number }>;
}

export function LineChartComponent({ data }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <RechartsLineChart data={data}>
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
          formatter={(value: number) => [`฿${value.toLocaleString()}`, "รายจ่าย"]}
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#F4C0D1"
          strokeWidth={3}
          dot={{ fill: "#F4C0D1", strokeWidth: 0, r: 5 }}
          activeDot={{ fill: "#E8A0B8", strokeWidth: 0, r: 7 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
