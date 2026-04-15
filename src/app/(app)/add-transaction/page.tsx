"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Category { id: string; name: string; type: string; color: string; icon: string; }
interface Account { id: string; name: string; type: string; }

export default function AddTransactionPage() {
  const router = useRouter();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/accounts").then((r) => r.json()),
    ]).then(([cats, accs]) => {
      setCategories(Array.isArray(cats) ? cats : []);
      const accList = Array.isArray(accs) ? accs : [];
      setAccounts(accList);
      if (accList.length > 0) setAccountId(accList[0].id);
      setLoadingData(false);
    }).catch(() => setLoadingData(false));
  }, []);

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId || !accountId) {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseFloat(amount),
        type,
        note,
        categoryId,
        accountId,
        date,
      }),
    });
    if (res.ok) {
      toast.success(type === "expense" ? "บันทึกรายจ่ายแล้ว! 💸" : "บันทึกรายรับแล้ว! 💰");
      router.push("/transactions");
    } else {
      toast.error("บันทึกไม่สำเร็จ");
    }
    setSaving(false);
  };

  if (loadingData) {
    return <AppLayout title="เพิ่มรายการ"><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sakura" /></div></AppLayout>;
  }

  return (
    <AppLayout title="เพิ่มรายการ">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex rounded-2xl bg-cream dark:bg-cream-dark p-1">
          <button
            type="button"
            onClick={() => { setType("expense"); setCategoryId(""); }}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
              type === "expense"
                ? "bg-sakura/30 text-sakura-dark shadow-sm"
                : "text-ink/50 dark:text-ink-dark/50 hover:text-ink dark:hover:text-ink-dark"
            )}
          >
            รายจ่าย 💸
          </button>
          <button
            type="button"
            onClick={() => { setType("income"); setCategoryId(""); }}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
              type === "income"
                ? "bg-mint/30 text-green-700 shadow-sm"
                : "text-ink/50 dark:text-ink-dark/50 hover:text-ink dark:hover:text-ink-dark"
            )}
          >
            รายรับ 💰
          </button>
        </div>

        {/* Amount */}
        <Card className="text-center py-6">
          <p className="text-sm text-ink/50 dark:text-ink-dark/50 mb-2">จำนวนเงิน (บาท)</p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="text-4xl font-bold text-ink dark:text-ink-dark text-center bg-transparent outline-none w-full"
            required
          />
        </Card>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-ink/70 dark:text-ink-dark/70 mb-2">หมวดหมู่</label>
          {filteredCategories.length === 0 ? (
            <p className="text-sm text-ink/40 dark:text-ink-dark/40">ยังไม่มีหมวดหมู่ กรุณาทำ Onboarding ก่อน</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={cn(
                    "px-3 py-2 rounded-full text-sm border transition-all",
                    categoryId === cat.id
                      ? type === "expense"
                        ? "border-sakura bg-sakura/10 text-sakura-dark"
                        : "border-mint bg-mint/10 text-green-700"
                      : "border-sakura/20 bg-white dark:bg-[#333330] text-ink/50 dark:text-ink-dark/50 hover:bg-cream dark:hover:bg-[#3a3a37]"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Account */}
        <div>
          <label className="block text-sm font-medium text-ink/70 dark:text-ink-dark/70 mb-2">บัญชี</label>
          {accounts.length === 0 ? (
            <p className="text-sm text-ink/40 dark:text-ink-dark/40">ยังไม่มีบัญชี กรุณาเพิ่มบัญชีก่อน</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setAccountId(acc.id)}
                  className={cn(
                    "px-3 py-2 rounded-full text-sm border transition-all",
                    accountId === acc.id
                      ? "border-lavender bg-lavender/10 text-purple-700"
                      : "border-sakura/20 bg-white dark:bg-[#333330] text-ink/50 dark:text-ink-dark/50 hover:bg-cream dark:hover:bg-[#3a3a37]"
                  )}
                >
                  {acc.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Note & Date */}
        <Input
          label="บันทึก"
          placeholder="เช่น ก๋วยเตี๋ยวเรือ, ค่ารถไฟฟ้า"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Input
          label="วันที่"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Submit */}
        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "กำลังบันทึก..." : type === "expense" ? "บันทึกรายจ่าย 💸" : "บันทึกรายรับ 💰"}
        </Button>
      </form>
    </AppLayout>
  );
}
