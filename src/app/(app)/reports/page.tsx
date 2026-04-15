"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BarChartComponent } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { LineChartComponent } from "@/components/charts/LineChart";
import { mockChartData } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Download } from "lucide-react";

export default function ReportsPage() {
  const totalIncome = mockChartData.incomeVsExpense.reduce((s, d) => s + d.income, 0);
  const totalExpense = mockChartData.incomeVsExpense.reduce((s, d) => s + d.expense, 0);
  const net = totalIncome - totalExpense;

  return (
    <AppLayout title="รายงาน">
      <div className="space-y-6">
        {/* Monthly Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <p className="text-xs text-ink/50">รายรับ</p>
            <p className="text-lg font-bold text-green-600 mt-1">{formatCurrency(totalIncome)}</p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-ink/50">รายจ่าย</p>
            <p className="text-lg font-bold text-sakura-dark mt-1">{formatCurrency(totalExpense)}</p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-ink/50">คงเหลือ</p>
            <p className={`text-lg font-bold mt-1 ${net >= 0 ? "text-green-600" : "text-red-500"}`}>
              {formatCurrency(net)}
            </p>
          </Card>
        </div>

        {/* Income vs Expense */}
        <Card>
          <CardHeader><CardTitle>รายรับ vs รายจ่าย (6 เดือน)</CardTitle></CardHeader>
          <CardContent><BarChartComponent data={mockChartData.incomeVsExpense} /></CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader><CardTitle>สัดส่วนรายจ่าย</CardTitle></CardHeader>
          <CardContent><DonutChart data={mockChartData.expenseByCategory} /></CardContent>
        </Card>

        {/* Spending Trend */}
        <Card>
          <CardHeader><CardTitle>แนวโน้มรายจ่าย</CardTitle></CardHeader>
          <CardContent>
            <LineChartComponent
              data={mockChartData.incomeVsExpense.map((d) => ({ month: d.month, expense: d.expense }))}
            />
          </CardContent>
        </Card>

        {/* Export */}
        <Button variant="secondary" className="w-full">
          <Download className="w-4 h-4" /> Export PDF
        </Button>
      </div>
    </AppLayout>
  );
}
