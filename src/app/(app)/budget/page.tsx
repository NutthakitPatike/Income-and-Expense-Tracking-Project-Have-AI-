"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockBudgets } from "@/lib/mock-data";
import { formatCurrency, getPercentage, getBudgetBgColor } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function BudgetPage() {
  return (
    <AppLayout title="งบประมาณ">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-ink/50">งบประมาณเดือนเมษายน 2026</p>
          <Button size="sm">
            <Plus className="w-4 h-4" /> เพิ่มงบ
          </Button>
        </div>

        <div className="grid gap-4">
          {mockBudgets.map((budget) => {
            const pct = getPercentage(budget.spent, budget.amount);
            const remaining = budget.amount - budget.spent;
            return (
              <Card key={budget.id}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${budget.category.color}30` }}
                    >
                      {budget.category.name === "อาหาร" ? "🍜" : budget.category.name === "เดินทาง" ? "🚗" : budget.category.name === "ช้อปปิ้ง" ? "🛍️" : "🎮"}
                    </div>
                    <div>
                      <p className="font-semibold text-ink text-sm">{budget.category.name}</p>
                      <p className="text-xs text-ink/40">รายเดือน</p>
                    </div>
                  </div>
                  {pct >= 80 && (
                    <Badge variant={pct >= 100 ? "danger" : "warning"}>
                      {pct >= 100 ? "เกินงบ!" : `${pct}%`}
                    </Badge>
                  )}
                </div>
                <div className="w-full h-3 bg-cream rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getBudgetBgColor(pct)}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-ink/50">
                  <span>ใช้ไป {formatCurrency(budget.spent)}</span>
                  <span>เหลือ {formatCurrency(Math.max(remaining, 0))}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
