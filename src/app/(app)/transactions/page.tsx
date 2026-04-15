"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/utils";
import { Search, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface Transaction {
  id: string;
  note: string;
  amount: number;
  type: string;
  date: string;
  category?: { name: string; color: string };
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const fetchTx = () => {
    fetch("/api/transactions").then((r) => r.json()).then((d) => {
      setTransactions(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchTx(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("ลบรายการนี้?")) return;
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("ลบรายการแล้ว");
      fetchTx();
    } else {
      toast.error("ลบไม่สำเร็จ");
    }
  };

  const filtered = transactions.filter((tx) => {
    const matchSearch = !search || tx.note?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || tx.type === filterType;
    return matchSearch && matchType;
  });

  if (loading) {
    return <AppLayout title="รายการทั้งหมด"><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sakura" /></div></AppLayout>;
  }

  return (
    <AppLayout title="รายการทั้งหมด">
      <div className="space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
            <input
              type="text"
              placeholder="ค้นหารายการ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-mochi pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "income", "expense"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium border transition-all ${
                  filterType === type
                    ? "bg-sakura/20 border-sakura text-sakura-dark"
                    : "bg-white border-sakura/20 text-ink/50 hover:bg-cream"
                }`}
              >
                {type === "all" ? "ทั้งหมด" : type === "income" ? "รายรับ" : "รายจ่าย"}
              </button>
            ))}
          </div>
        </div>

        {/* Add button */}
        <div className="flex justify-end">
          <Link href="/add-transaction">
            <Button size="sm">เพิ่มรายการ</Button>
          </Link>
        </div>

        {/* Transaction List */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="ไม่พบรายการ"
            description="เพิ่มรายการแรกของคุณได้เลย!"
          />
        ) : (
          <Card>
            <div className="divide-y divide-sakura/10">
              {filtered.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 py-3 group">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: `${tx.category?.color || '#F4C0D1'}30` }}
                  >
                    {tx.type === "income" ? "💰" : "🛒"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{tx.note || "ไม่มีรายละเอียด"}</p>
                    <p className="text-xs text-ink/40">
                      {tx.category?.name || "ไม่มีหมวด"} •{" "}
                      {new Date(tx.date).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold whitespace-nowrap ${
                      tx.type === "income" ? "text-green-600" : "text-sakura-dark"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="p-1.5 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
