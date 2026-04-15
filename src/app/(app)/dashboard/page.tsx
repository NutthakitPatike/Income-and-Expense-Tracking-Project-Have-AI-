"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DonutChart } from "@/components/charts/DonutChart";
import { formatCurrency, getPercentage, getBudgetBgColor } from "@/lib/utils";
import { TrendingUp, TrendingDown, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  accounts: { id: string; name: string; balance: number; type: string; color: string }[];
  recentTransactions: { id: string; note: string; amount: number; type: string; date: string; category?: { name: string; color: string } }[];
  budgets: { id: string; amount: number; spent: number; category: { name: string; color: string } }[];
  expenseBreakdown: { name: string; value: number }[];
  unreadNotifs: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then((d) => {
      setData(d);
      setLoading(false);
    }).catch(() => setLoading(false));

    fetch("/api/insight").then((r) => r.json()).then((d) => {
      setInsight(d.insight || "");
    }).catch(() => {});
  }, []);

  if (loading) {
    return (
      <AppLayout title="Dashboard">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-sakura" />
        </div>
      </AppLayout>
    );
  }

  if (!data) {
    return (
      <AppLayout title="Dashboard">
        <div className="text-center py-20 text-ink/50 dark:text-ink-dark/50">ไม่สามารถโหลดข้อมูลได้</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Total Balance Card */}
        <Card className="bg-gradient-to-br from-sakura/40 via-lavender/20 to-mint/20 border-none">
          <p className="text-sm text-ink/60 dark:text-ink-dark/60 font-medium">ยอดเงินทั้งหมด</p>
          <p className="text-3xl font-bold text-ink dark:text-ink-dark mt-1">
            {formatCurrency(data.totalBalance)}
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-sm">
              <div className="w-6 h-6 rounded-full bg-mint/30 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              </div>
              <span className="text-ink/60 dark:text-ink-dark/60">รายรับ</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(data.monthlyIncome)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <div className="w-6 h-6 rounded-full bg-sakura/30 flex items-center justify-center">
                <TrendingDown className="w-3.5 h-3.5 text-sakura-dark" />
              </div>
              <span className="text-ink/60 dark:text-ink-dark/60">รายจ่าย</span>
              <span className="font-semibold text-sakura-dark">
                {formatCurrency(data.monthlyExpense)}
              </span>
            </div>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>รายการล่าสุด</CardTitle>
            <Link
              href="/transactions"
              className="text-xs text-sakura-dark hover:underline flex items-center gap-1"
            >
              ดูทั้งหมด <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {data.recentTransactions.length === 0 ? (
              <p className="text-sm text-ink/40 dark:text-ink-dark/40 text-center py-4">ยังไม่มีรายการ</p>
            ) : (
              <div className="divide-y divide-sakura/10 dark:divide-sakura/5">
                {data.recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-3 py-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${tx.category?.color || '#F4C0D1'}30` }}
                    >
                      {tx.type === "income" ? "💰" : "🛒"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink dark:text-ink-dark truncate">
                        {tx.note || "ไม่มีรายละเอียด"}
                      </p>
                      <p className="text-xs text-ink/40 dark:text-ink-dark/40">
                        {tx.category?.name || "ไม่มีหมวด"} •{" "}
                        {new Date(tx.date).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        tx.type === "income" ? "text-green-600" : "text-sakura-dark"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Budget Progress */}
        {data.budgets.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>งบประมาณเดือนนี้</CardTitle>
              <Link
                href="/budget"
                className="text-xs text-sakura-dark hover:underline flex items-center gap-1"
              >
                จัดการ <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.budgets.map((budget) => {
                const pct = getPercentage(budget.spent, budget.amount);
                return (
                  <div key={budget.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-ink dark:text-ink-dark">
                          {budget.category.name}
                        </span>
                        {pct >= 80 && (
                          <Badge variant={pct >= 100 ? "danger" : "warning"}>
                            {pct >= 100 ? "เกินงบ!" : "ใกล้เกิน"}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-ink/50 dark:text-ink-dark/50">
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-cream dark:bg-cream-dark rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getBudgetBgColor(pct)}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Expense Breakdown */}
        {data.expenseBreakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>สัดส่วนรายจ่าย</CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart data={data.expenseBreakdown} />
            </CardContent>
          </Card>
        )}

        {/* Mochi Insight */}
        {insight && (
          <Card className="bg-gradient-to-r from-lavender/20 to-sakura/20 border-lavender/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-lavender/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink dark:text-ink-dark mb-1">
                  🍡 Mochi Insight
                </p>
                <p className="text-sm text-ink/70 dark:text-ink-dark/70 leading-relaxed">
                  {insight}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Account Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-ink dark:text-ink-dark">บัญชีของคุณ</h3>
            <Link
              href="/accounts"
              className="text-xs text-sakura-dark hover:underline flex items-center gap-1"
            >
              ดูทั้งหมด <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {data.accounts.length === 0 ? (
            <p className="text-sm text-ink/40 dark:text-ink-dark/40 text-center py-4">ยังไม่มีบัญชี เพิ่มบัญชีแรกได้ที่หน้าบัญชี</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.accounts.map((account) => (
                <Card key={account.id} className="relative overflow-hidden">
                  <div
                    className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"
                    style={{ backgroundColor: account.color }}
                  />
                  <p className="text-xs text-ink/50 dark:text-ink-dark/50 font-medium">{account.name}</p>
                  <p className="text-lg font-bold text-ink dark:text-ink-dark mt-1">
                    {formatCurrency(account.balance)}
                  </p>
                  <Badge className="mt-2">
                    {account.type === "cash"
                      ? "เงินสด"
                      : account.type === "bank"
                      ? "ธนาคาร"
                      : "E-Wallet"}
                  </Badge>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
