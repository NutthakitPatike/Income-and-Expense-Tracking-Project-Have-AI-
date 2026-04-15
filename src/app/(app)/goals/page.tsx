"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProgressRing } from "@/components/charts/ProgressRing";
import { formatCurrency, getPercentage } from "@/lib/utils";
import { Plus, Calendar, Loader2, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
  deadline?: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [saving, setSaving] = useState(false);
  const [addAmountId, setAddAmountId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState("");

  const fetchGoals = () => {
    fetch("/api/goals").then((r) => r.json()).then((d) => {
      setGoals(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleCreate = async () => {
    if (!newName || !newTarget) { toast.error("กรุณากรอกข้อมูลให้ครบ"); return; }
    setSaving(true);
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, targetAmount: parseFloat(newTarget), deadline: newDeadline || undefined }),
    });
    if (res.ok) {
      toast.success("เพิ่มเป้าหมายแล้ว! 🎯");
      setShowForm(false); setNewName(""); setNewTarget(""); setNewDeadline("");
      fetchGoals();
    } else { toast.error("เพิ่มไม่สำเร็จ"); }
    setSaving(false);
  };

  const handleAddAmount = async (id: string) => {
    if (!addAmount || parseFloat(addAmount) <= 0) { toast.error("กรุณาใส่จำนวนเงิน"); return; }
    const res = await fetch(`/api/goals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addAmount: parseFloat(addAmount) }),
    });
    if (res.ok) {
      toast.success("เพิ่มเงินแล้ว! 💰");
      setAddAmountId(null); setAddAmount("");
      fetchGoals();
    } else { toast.error("เพิ่มเงินไม่สำเร็จ"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ลบเป้าหมายนี้?")) return;
    const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("ลบเป้าหมายแล้ว"); fetchGoals(); }
    else { toast.error("ลบไม่สำเร็จ"); }
  };

  if (loading) {
    return <AppLayout title="เป้าหมายออม"><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sakura" /></div></AppLayout>;
  }

  return (
    <AppLayout title="เป้าหมายออม">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-ink/50 dark:text-ink-dark/50">เป้าหมายการออมของคุณ</p>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> เพิ่มเป้าหมาย
          </Button>
        </div>

        {showForm && (
          <Card className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-ink dark:text-ink-dark text-sm">เพิ่มเป้าหมายใหม่</p>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-ink/40" /></button>
            </div>
            <Input label="ชื่อเป้าหมาย" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="เช่น iPhone 16, ท่องเที่ยวญี่ปุ่น" />
            <Input label="ยอดเงินเป้าหมาย (บาท)" type="number" value={newTarget} onChange={(e) => setNewTarget(e.target.value)} placeholder="50000" />
            <Input label="กำหนดวัน (ไม่บังคับ)" type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} />
            <Button onClick={handleCreate} disabled={saving} className="w-full">
              {saving ? "กำลังบันทึก..." : "เพิ่มเป้าหมาย"}
            </Button>
          </Card>
        )}

        {goals.length === 0 ? (
          <p className="text-center text-ink/40 dark:text-ink-dark/40 py-8">ยังไม่มีเป้าหมาย กดเพิ่มเป้าหมายแรกได้เลย!</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {goals.map((goal) => {
              const pct = getPercentage(goal.currentAmount, goal.targetAmount);
              return (
                <Card key={goal.id}>
                  <div className="flex items-center gap-4">
                    <ProgressRing percentage={pct} size={72} color={goal.color || "#F4C0D1"}>
                      <span className="text-xs font-bold text-ink dark:text-ink-dark">{pct}%</span>
                    </ProgressRing>
                    <div className="flex-1">
                      <p className="font-semibold text-ink dark:text-ink-dark">{goal.name}</p>
                      <p className="text-sm text-ink/50 dark:text-ink-dark/50 mt-0.5">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                      </p>
                      {goal.deadline && (
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-ink/40 dark:text-ink-dark/40">
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
                  {addAmountId === goal.id ? (
                    <div className="flex gap-2 mt-3">
                      <input type="number" value={addAmount} onChange={(e) => setAddAmount(e.target.value)}
                        placeholder="จำนวนเงิน" className="input-mochi flex-1 text-sm" />
                      <Button size="sm" onClick={() => handleAddAmount(goal.id)}>เพิ่ม</Button>
                      <button onClick={() => { setAddAmountId(null); setAddAmount(""); }} className="text-ink/40"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-3">
                      <Button variant="secondary" size="sm" className="flex-1" onClick={() => setAddAmountId(goal.id)}>
                        เพิ่มเงิน
                      </Button>
                      <button onClick={() => handleDelete(goal.id)} className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
