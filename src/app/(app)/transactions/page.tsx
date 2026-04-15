"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { mockTransactions, mockCategories } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Search, Filter, Download, Pencil, Trash2 } from "lucide-react";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filtered = mockTransactions.filter((tx) => {
    const matchSearch = !search || tx.note?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || tx.type === filterType;
    return matchSearch && matchType;
  });

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

        {/* Export Button */}
        <div className="flex justify-end">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        {/* Transaction List */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="ไม่พบรายการ"
            description="ลองเปลี่ยนคำค้นหาหรือตัวกรอง"
          />
        ) : (
          <Card>
            <div className="divide-y divide-sakura/10">
              {filtered.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 py-3 group">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: `${tx.category?.color}30` }}
                  >
                    {tx.type === "income" ? "💰" : "🛒"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{tx.note}</p>
                    <p className="text-xs text-ink/40">
                      {tx.category?.name} •{" "}
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
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button className="p-1.5 rounded-full hover:bg-cream">
                      <Pencil className="w-3.5 h-3.5 text-ink/40" />
                    </button>
                    <button className="p-1.5 rounded-full hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
