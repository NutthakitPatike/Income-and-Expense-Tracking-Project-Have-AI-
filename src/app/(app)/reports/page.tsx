"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DonutChart } from "@/components/charts/DonutChart";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function ReportsPage() {
  const [data, setData] = useState<{
    monthlyIncome: number;
    monthlyExpense: number;
    expenseBreakdown: { name: string; value: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then((d) => {
      setData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <AppLayout title="รายงาน"><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sakura" /></div></AppLayout>;
  }

  const totalIncome = data?.monthlyIncome || 0;
  const totalExpense = data?.monthlyExpense || 0;
  const net = totalIncome - totalExpense;

  return (
    <AppLayout title="รายงาน">
      <div className="space-y-6">
        {/* Monthly Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <p className="text-xs text-ink/50 dark:text-ink-dark/50">รายรับ</p>
            <p className="text-lg font-bold text-green-600 mt-1">{formatCurrency(totalIncome)}</p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-ink/50 dark:text-ink-dark/50">รายจ่าย</p>
            <p className="text-lg font-bold text-sakura-dark mt-1">{formatCurrency(totalExpense)}</p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-ink/50 dark:text-ink-dark/50">คงเหลือ</p>
            <p className={`text-lg font-bold mt-1 ${net >= 0 ? "text-green-600" : "text-red-500"}`}>
              {formatCurrency(net)}
            </p>
          </Card>
        </div>

        {/* Expense Breakdown */}
        {data?.expenseBreakdown && data.expenseBreakdown.length > 0 && (
          <Card>
            <CardHeader><CardTitle>สัดส่วนรายจ่ายเดือนนี้</CardTitle></CardHeader>
            <CardContent><DonutChart data={data.expenseBreakdown} /></CardContent>
          </Card>
        )}

        {totalIncome === 0 && totalExpense === 0 && (
          <p className="text-center text-ink/40 dark:text-ink-dark/40 py-8">ยังไม่มีข้อมูลรายการ เพิ่มรายการแรกเพื่อดูรายงาน!</p>
        )}
      </div>
    </AppLayout>
  );
}
