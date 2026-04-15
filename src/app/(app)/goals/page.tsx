"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/charts/ProgressRing";
import { mockSavingGoals } from "@/lib/mock-data";
import { formatCurrency, getPercentage } from "@/lib/utils";
import { Plus, Calendar } from "lucide-react";

export default function GoalsPage() {
  return (
    <AppLayout title="เป้าหมายออม">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-ink/50">เป้าหมายการออมของคุณ</p>
          <Button size="sm">
            <Plus className="w-4 h-4" /> เพิ่มเป้าหมาย
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {mockSavingGoals.map((goal) => {
            const pct = getPercentage(goal.currentAmount, goal.targetAmount);
            return (
              <Card key={goal.id}>
                <div className="flex items-center gap-4">
                  <ProgressRing percentage={pct} size={72} color={goal.color}>
                    <span className="text-xs font-bold text-ink">{pct}%</span>
                  </ProgressRing>
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{goal.name}</p>
                    <p className="text-sm text-ink/50 mt-0.5">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </p>
                    {goal.deadline && (
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-ink/40">
                        <Calendar className="w-3 h-3" />
                        <span>
                          กำหนด{" "}
                          {new Date(goal.deadline).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="w-full mt-3">
                  เพิ่มเงิน
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
