"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency, getPercentage, getBudgetBgColor } from "@/lib/utils";
import { Plus, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

interface Budget {
  id: string;
  amount: number;
  spent: number;
  category: { id: string; name: string; color: string; icon: string };
}
interface Category { id: string; name: string; color: string; type: string; }

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCatId, setNewCatId] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    Promise.all([
      fetch("/api/budgets").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([b, c]) => {
      setBudgets(Array.isArray(b) ? b : []);
      setCategories(Array.isArray(c) ? c.filter((cat: Category) => cat.type === "expense") : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    if (!newCatId || !newAmount) { toast.error("กรุณาเลือกหมวดและใส่จำนวนงบ"); return; }
    setSaving(true);
    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId: newCatId, amount: newAmount }),
    });
    if (res.ok) {
      toast.success("เพิ่มงบประมาณแล้ว! 🎉");
      setShowForm(false); setNewCatId(""); setNewAmount("");
      fetchData();
    } else { toast.error("เพิ่มงบไม่สำเร็จ"); }
    setSaving(false);
  };

  if (loading) {
    return <AppLayout title="งบประมาณ"><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sakura" /></div></AppLayout>;
  }

  return (
    <AppLayout title="งบประมาณ">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-ink/50 dark:text-ink-dark/50">งบประมาณเดือนนี้</p>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> เพิ่มงบ
          </Button>
        </div>

        {showForm && (
          <Card className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-ink dark:text-ink-dark text-sm">เพิ่มงบประมาณ</p>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-ink/40" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 dark:text-ink-dark/70 mb-2">หมวดหมู่</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button key={cat.id} type="button" onClick={() => setNewCatId(cat.id)}
                    className={`px-3 py-2 rounded-full text-sm border transition-all ${newCatId === cat.id ? "bg-sakura/20 border-sakura text-sakura-dark" : "bg-white dark:bg-[#333330] border-sakura/20 text-ink/50 dark:text-ink-dark/50"}`}
                  >{cat.name}</button>
                ))}
              </div>
            </div>
            <Input label="วงเงินงบ (บาท)" type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="เช่น 3000" />
            <Button onClick={handleCreate} disabled={saving} className="w-full">
              {saving ? "กำลังบันทึก..." : "เพิ่มงบประมาณ"}
            </Button>
          </Card>
        )}

        {budgets.length === 0 ? (
          <p className="text-center text-ink/40 dark:text-ink-dark/40 py-8">ยังไม่มีงบประมาณ กดเพิ่มงบได้เลย!</p>
        ) : (
          <div className="grid gap-4">
            {budgets.map((budget) => {
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
                        {budget.category.icon || "�"}
                      </div>
                      <div>
                        <p className="font-semibold text-ink dark:text-ink-dark text-sm">{budget.category.name}</p>
                        <p className="text-xs text-ink/40 dark:text-ink-dark/40">รายเดือน</p>
                      </div>
                    </div>
                    {pct >= 80 && (
                      <Badge variant={pct >= 100 ? "danger" : "warning"}>
                        {pct >= 100 ? "เกินงบ!" : `${pct}%`}
                      </Badge>
                    )}
                  </div>
                  <div className="w-full h-3 bg-cream dark:bg-cream-dark rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getBudgetBgColor(pct)}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-ink/50 dark:text-ink-dark/50">
                    <span>ใช้ไป {formatCurrency(budget.spent)}</span>
                    <span>เหลือ {formatCurrency(Math.max(remaining, 0))}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
