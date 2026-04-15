"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { Plus, Wallet, Building2, Smartphone, Loader2, X, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const iconMap: Record<string, React.ReactNode> = {
  cash: <Wallet className="w-5 h-5" />,
  bank: <Building2 className="w-5 h-5" />,
  wallet: <Smartphone className="w-5 h-5" />,
};

const typeLabel: Record<string, string> = {
  cash: "เงินสด",
  bank: "ธนาคาร",
  wallet: "E-Wallet",
};

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  color: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("bank");
  const [newBalance, setNewBalance] = useState("");
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchAccounts = () => {
    fetch("/api/accounts").then((r) => r.json()).then((d) => {
      setAccounts(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchAccounts(); }, []);

  const resetForm = () => {
    setNewName(""); setNewBalance(""); setNewType("bank");
    setEditId(null); setShowForm(false);
  };

  const openEdit = (acc: Account) => {
    setEditId(acc.id);
    setNewName(acc.name);
    setNewType(acc.type);
    setNewBalance(String(acc.balance));
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!newName) { toast.error("กรุณาใส่ชื่อบัญชี"); return; }
    setSaving(true);
    try {
      if (editId) {
        const res = await fetch(`/api/accounts/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName, type: newType, balance: parseFloat(newBalance || "0") }),
        });
        if (res.ok) {
          toast.success("แก้ไขบัญชีแล้ว! ✏️");
          resetForm(); fetchAccounts();
        } else { toast.error("แก้ไขไม่สำเร็จ"); }
      } else {
        const res = await fetch("/api/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName, type: newType, balance: parseFloat(newBalance || "0") }),
        });
        if (res.ok) {
          toast.success("เพิ่มบัญชีสำเร็จ! 🎉");
          resetForm(); fetchAccounts();
        } else { toast.error("เพิ่มบัญชีไม่สำเร็จ"); }
      }
    } catch { toast.error("เกิดข้อผิดพลาด"); }
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/accounts/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("ลบบัญชีแล้ว");
        fetchAccounts();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || "ลบไม่สำเร็จ");
      }
    } catch { toast.error("เกิดข้อผิดพลาด"); }
    setDeleteId(null);
  };

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  if (loading) {
    return <AppLayout title="บัญชี"><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sakura" /></div></AppLayout>;
  }

  return (
    <AppLayout title="บัญชี">
      <div className="space-y-4">
        <Card className="bg-gradient-to-br from-sakura/30 to-lavender/20 border-none text-center">
          <p className="text-sm text-ink/60 dark:text-ink-dark/60">ยอดเงินทั้งหมด</p>
          <p className="text-3xl font-bold text-ink dark:text-ink-dark mt-1">{formatCurrency(totalBalance)}</p>
        </Card>

        <div className="flex justify-between items-center">
          <p className="text-sm text-ink/50 dark:text-ink-dark/50">บัญชีของคุณ ({accounts.length})</p>
          <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="w-4 h-4" /> เพิ่มบัญชี
          </Button>
        </div>

        {/* Add Account Form */}
        {showForm && (
          <Card className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-ink dark:text-ink-dark text-sm">{editId ? "แก้ไขบัญชี" : "เพิ่มบัญชีใหม่"}</p>
              <button onClick={resetForm}><X className="w-4 h-4 text-ink/40" /></button>
            </div>
            <Input label="ชื่อบัญชี" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="เช่น ธนาคารกสิกร" />
            <div>
              <label className="block text-sm font-medium text-ink/70 dark:text-ink-dark/70 mb-2">ประเภท</label>
              <div className="flex gap-2">
                {["cash", "bank", "wallet"].map((t) => (
                  <button key={t} type="button" onClick={() => setNewType(t)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${newType === t ? "bg-sakura/20 border-sakura text-sakura-dark" : "bg-white dark:bg-[#333330] border-sakura/20 text-ink/50 dark:text-ink-dark/50"}`}
                  >{typeLabel[t]}</button>
                ))}
              </div>
            </div>
            <Input label={editId ? "ยอดเงิน" : "ยอดเงินเริ่มต้น"} type="number" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} placeholder="0" />
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "กำลังบันทึก..." : editId ? "บันทึกการแก้ไข" : "เพิ่มบัญชี"}
            </Button>
          </Card>
        )}

        <div className="grid gap-3">
          {accounts.map((account) => (
            <Card key={account.id} className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${account.color}30`, color: account.color }}
              >
                {iconMap[account.type] || <Wallet className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink dark:text-ink-dark text-sm truncate">{account.name}</p>
                <Badge className="mt-0.5">{typeLabel[account.type] || account.type}</Badge>
              </div>
              <p className="font-bold text-ink dark:text-ink-dark text-sm whitespace-nowrap">{formatCurrency(account.balance)}</p>
              <div className="flex gap-1">
                <button onClick={() => openEdit(account)} className="p-2 rounded-xl hover:bg-cream dark:hover:bg-[#3a3a37] transition-colors">
                  <Pencil className="w-4 h-4 text-ink/40 dark:text-ink-dark/40" />
                </button>
                <button onClick={() => setDeleteId(account.id)} className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </Card>
          ))}
          {accounts.length === 0 && (
            <p className="text-center text-ink/40 dark:text-ink-dark/40 py-8">ยังไม่มีบัญชี กดปุ่มเพิ่มบัญชีแรกของคุณ!</p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#333330] rounded-3xl p-6 max-w-sm w-full shadow-xl space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <p className="font-semibold text-ink dark:text-ink-dark">ลบบัญชีนี้?</p>
              <p className="text-sm text-ink/50 dark:text-ink-dark/50 mt-1">บัญชีที่มีรายการธุรกรรมอยู่จะไม่สามารถลบได้</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setDeleteId(null)} className="flex-1 !bg-gray-100 !text-ink/70 hover:!bg-gray-200">
                ยกเลิก
              </Button>
              <Button onClick={confirmDelete} className="flex-1 !bg-red-500 hover:!bg-red-600 !text-white">
                ลบเลย
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
