"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { Plus, Wallet, Building2, Smartphone, Loader2, X } from "lucide-react";
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

  const fetchAccounts = () => {
    fetch("/api/accounts").then((r) => r.json()).then((d) => {
      setAccounts(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleCreate = async () => {
    if (!newName) { toast.error("กรุณาใส่ชื่อบัญชี"); return; }
    setSaving(true);
    const res = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, type: newType, balance: parseFloat(newBalance || "0") }),
    });
    if (res.ok) {
      toast.success("เพิ่มบัญชีสำเร็จ! 🎉");
      setShowForm(false);
      setNewName(""); setNewBalance(""); setNewType("bank");
      fetchAccounts();
    } else {
      toast.error("เพิ่มบัญชีไม่สำเร็จ");
    }
    setSaving(false);
  };

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  if (loading) {
    return <AppLayout title="บัญชี"><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sakura" /></div></AppLayout>;
  }

  return (
    <AppLayout title="บัญชี">
      <div className="space-y-4">
        <Card className="bg-gradient-to-br from-sakura/30 to-lavender/20 border-none text-center">
          <p className="text-sm text-ink/60">ยอดเงินทั้งหมด</p>
          <p className="text-3xl font-bold text-ink mt-1">{formatCurrency(totalBalance)}</p>
        </Card>

        <div className="flex justify-between items-center">
          <p className="text-sm text-ink/50">บัญชีของคุณ ({accounts.length})</p>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> เพิ่มบัญชี
          </Button>
        </div>

        {/* Add Account Form */}
        {showForm && (
          <Card className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-ink text-sm">เพิ่มบัญชีใหม่</p>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-ink/40" /></button>
            </div>
            <Input label="ชื่อบัญชี" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="เช่น ธนาคารกสิกร" />
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">ประเภท</label>
              <div className="flex gap-2">
                {["cash", "bank", "wallet"].map((t) => (
                  <button key={t} type="button" onClick={() => setNewType(t)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${newType === t ? "bg-sakura/20 border-sakura text-sakura-dark" : "bg-white border-sakura/20 text-ink/50"}`}
                  >{typeLabel[t]}</button>
                ))}
              </div>
            </div>
            <Input label="ยอดเงินเริ่มต้น" type="number" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} placeholder="0" />
            <Button onClick={handleCreate} disabled={saving} className="w-full">
              {saving ? "กำลังบันทึก..." : "เพิ่มบัญชี"}
            </Button>
          </Card>
        )}

        <div className="grid gap-3">
          {accounts.map((account) => (
            <Card key={account.id} className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${account.color}30`, color: account.color }}
              >
                {iconMap[account.type] || <Wallet className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink text-sm">{account.name}</p>
                <Badge className="mt-0.5">{typeLabel[account.type] || account.type}</Badge>
              </div>
              <p className="font-bold text-ink">{formatCurrency(account.balance)}</p>
            </Card>
          ))}
          {accounts.length === 0 && (
            <p className="text-center text-ink/40 py-8">ยังไม่มีบัญชี กดปุ่มเพิ่มบัญชีแรกของคุณ!</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
