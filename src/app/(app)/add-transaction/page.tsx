"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { mockCategories, mockAccounts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";

export default function AddTransactionPage() {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState(mockAccounts[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const filteredCategories = mockCategories.filter((c) => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    // TODO: Save transaction to DB
    toast.success(type === "expense" ? "บันทึกรายจ่ายแล้ว! 💸" : "บันทึกรายรับแล้ว! 💰");
    window.location.href = "/transactions";
  };

  return (
    <AppLayout title="เพิ่มรายการ">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex rounded-2xl bg-cream p-1">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
              type === "expense"
                ? "bg-sakura/30 text-sakura-dark shadow-sm"
                : "text-ink/50 hover:text-ink"
            )}
          >
            รายจ่าย 💸
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
              type === "income"
                ? "bg-mint/30 text-green-700 shadow-sm"
                : "text-ink/50 hover:text-ink"
            )}
          >
            รายรับ 💰
          </button>
        </div>

        {/* Amount */}
        <Card className="text-center py-6">
          <p className="text-sm text-ink/50 mb-2">จำนวนเงิน (บาท)</p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="text-4xl font-bold text-ink text-center bg-transparent outline-none w-full"
            required
          />
        </Card>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">หมวดหมู่</label>
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
                    : "border-sakura/20 bg-white text-ink/50 hover:bg-cream"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Account */}
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-2">บัญชี</label>
          <div className="flex flex-wrap gap-2">
            {mockAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => setAccountId(acc.id)}
                className={cn(
                  "px-3 py-2 rounded-full text-sm border transition-all",
                  accountId === acc.id
                    ? "border-lavender bg-lavender/10 text-purple-700"
                    : "border-sakura/20 bg-white text-ink/50 hover:bg-cream"
                )}
              >
                {acc.name}
              </button>
            ))}
          </div>
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

        {/* Receipt Upload */}
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-lavender/20 flex items-center justify-center">
            <Camera className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-ink">แนบใบเสร็จ</p>
            <p className="text-xs text-ink/40">รองรับ JPG, PNG</p>
          </div>
          <Button type="button" variant="secondary" size="sm">
            เลือกไฟล์
          </Button>
        </Card>

        {/* Submit */}
        <Button type="submit" className="w-full">
          {type === "expense" ? "บันทึกรายจ่าย 💸" : "บันทึกรายรับ 💰"}
        </Button>
      </form>
    </AppLayout>
  );
}
