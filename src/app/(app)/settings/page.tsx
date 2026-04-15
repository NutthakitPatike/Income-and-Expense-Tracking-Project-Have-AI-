"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  User,
  Bell,
  Palette,
  Download,
  LogOut,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "@/components/ThemeProvider";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  currency: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCurrency, setEditCurrency] = useState("THB");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((d) => {
        if (d.id) {
          setUser(d);
          setEditName(d.name || "");
          setEditCurrency(d.currency || "THB");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    if (!editName.trim()) { toast.error("กรุณาใส่ชื่อ"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), currency: editCurrency }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        toast.success("บันทึกโปรไฟล์แล้ว! ✏️");
        setShowEdit(false);
      } else { toast.error("บันทึกไม่สำเร็จ"); }
    } catch { toast.error("เกิดข้อผิดพลาด"); }
    setSaving(false);
  };

  const handleExport = async () => {
    try {
      const res = await fetch("/api/transactions?limit=9999");
      const data = await res.json();
      const txs = data.transactions || [];
      if (!txs.length) { toast.error("ไม่มีข้อมูลให้ Export"); return; }
      const header = "วันที่,ประเภท,จำนวน,หมายเหตุ,หมวดหมู่,บัญชี";
      const rows = txs.map((t: { date: string; type: string; amount: number; note: string; category?: { name: string }; account?: { name: string } }) =>
        `${new Date(t.date).toLocaleDateString("th-TH")},${t.type},${t.amount},"${t.note || ""}","${t.category?.name || ""}","${t.account?.name || ""}"`
      );
      const csv = [header, ...rows].join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `money-mochi-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click(); URL.revokeObjectURL(url);
      toast.success("Export สำเร็จ! 📥");
    } catch { toast.error("Export ไม่สำเร็จ"); }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "?";

  if (loading) {
    return <AppLayout title="ตั้งค่า"><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sakura" /></div></AppLayout>;
  }

  return (
    <AppLayout title="ตั้งค่า">
      <div className="space-y-4">
        {/* Profile Card */}
        <Card className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-sakura/30 flex items-center justify-center text-xl font-bold text-sakura-dark shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink dark:text-ink-dark truncate">{user?.name || "ไม่มีชื่อ"}</p>
            <p className="text-sm text-ink/40 dark:text-ink-dark/40 truncate">{user?.email}</p>
          </div>
          <button onClick={() => setShowEdit(true)} className="p-2 rounded-full hover:bg-cream dark:hover:bg-[#3a3a37] shrink-0">
            <ChevronRight className="w-5 h-5 text-ink/40 dark:text-ink-dark/40" />
          </button>
        </Card>

        {/* Edit Profile Form */}
        {showEdit && (
          <Card className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-ink dark:text-ink-dark text-sm">แก้ไขโปรไฟล์</p>
              <button onClick={() => setShowEdit(false)}><X className="w-4 h-4 text-ink/40" /></button>
            </div>
            <Input label="ชื่อ" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="ชื่อของคุณ" />
            <div>
              <label className="block text-sm font-medium text-ink/70 dark:text-ink-dark/70 mb-2">สกุลเงิน</label>
              <div className="flex gap-2">
                {["THB", "USD", "JPY"].map((c) => (
                  <button key={c} type="button" onClick={() => setEditCurrency(c)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${editCurrency === c ? "bg-sakura/20 border-sakura text-sakura-dark" : "bg-white dark:bg-[#333330] border-sakura/20 text-ink/50 dark:text-ink-dark/50"}`}
                  >{c}</button>
                ))}
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </Card>
        )}

        {/* Account Settings */}
        <div>
          <h3 className="text-sm font-semibold text-ink/50 dark:text-ink-dark/50 mb-2 px-1">บัญชี</h3>
          <Card className="divide-y divide-sakura/10 dark:divide-sakura/5">
            <button onClick={() => setShowEdit(true)} className="flex items-center gap-3 py-3 w-full">
              <User className="w-5 h-5 text-sakura" />
              <span className="flex-1 text-sm text-ink dark:text-ink-dark text-left">แก้ไขโปรไฟล์</span>
              <ChevronRight className="w-4 h-4 text-ink/30 dark:text-ink-dark/30" />
            </button>
          </Card>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-sm font-semibold text-ink/50 dark:text-ink-dark/50 mb-2 px-1">การตั้งค่า</h3>
          <Card className="divide-y divide-sakura/10 dark:divide-sakura/5">
            <div className="flex items-center gap-3 py-3">
              <Bell className="w-5 h-5 text-peach" />
              <span className="flex-1 text-sm text-ink dark:text-ink-dark">แจ้งเตือน Push</span>
              <button
                onClick={() => {
                  setPushEnabled(!pushEnabled);
                  toast.success(pushEnabled ? "ปิดแจ้งเตือนแล้ว" : "เปิดแจ้งเตือนแล้ว");
                }}
                className={`w-11 h-6 rounded-full transition-all ${
                  pushEnabled ? "bg-mint" : "bg-ink/20 dark:bg-ink-dark/20"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    pushEnabled ? "translate-x-5.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <button
              onClick={() => { toggleTheme(); toast.success(theme === "light" ? "เปลี่ยนเป็นโหมดมืด 🌙" : "เปลี่ยนเป็นโหมดสว่าง ☀️"); }}
              className="flex items-center gap-3 py-3 w-full"
            >
              <Palette className="w-5 h-5 text-lavender" />
              <span className="flex-1 text-sm text-ink dark:text-ink-dark text-left">ธีม</span>
              <span className="text-xs text-ink/40 dark:text-ink-dark/40">{theme === "light" ? "สว่าง ☀️" : "มืด 🌙"}</span>
              <ChevronRight className="w-4 h-4 text-ink/30 dark:text-ink-dark/30" />
            </button>
            <button onClick={handleExport} className="flex items-center gap-3 py-3 w-full">
              <Download className="w-5 h-5 text-sakura" />
              <span className="flex-1 text-sm text-ink dark:text-ink-dark text-left">Export ข้อมูล</span>
              <ChevronRight className="w-4 h-4 text-ink/30 dark:text-ink-dark/30" />
            </button>
          </Card>
        </div>

        {/* Danger Zone */}
        <div>
          <h3 className="text-sm font-semibold text-ink/50 dark:text-ink-dark/50 mb-2 px-1">อื่นๆ</h3>
          <Card>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full py-2 text-red-500 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">ออกจากระบบ</span>
            </button>
          </Card>
        </div>

        <p className="text-center text-xs text-ink/30 dark:text-ink-dark/30 pt-4">
          Money Mochi v1.0.0 • Made with 🍡
        </p>
      </div>
    </AppLayout>
  );
}
