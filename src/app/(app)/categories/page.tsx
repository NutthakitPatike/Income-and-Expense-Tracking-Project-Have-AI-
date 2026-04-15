"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Loader2, X, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const COLORS = [
  "#F4C0D1", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7",
  "#C7CEEA", "#9FE1CB", "#A0D2DB", "#D4A5FF", "#FFD700",
];

const ICONS = [
  "🍔", "🏠", "🚗", "🎮", "👗", "💊", "📚", "✈️", "💰", "🎁",
  "🛒", "☕", "📱", "🎬", "💡", "🏋️", "🐱", "👶", "🔧", "📁",
];

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📁");
  const [color, setColor] = useState("#F4C0D1");
  const [type, setType] = useState("expense");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const fetchCategories = () => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        setCategories(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setIcon("📁");
    setColor("#F4C0D1");
    setType("expense");
    setEditId(null);
    setShowForm(false);
  };

  const openEdit = (cat: Category) => {
    setEditId(cat.id);
    setName(cat.name);
    setIcon(cat.icon);
    setColor(cat.color);
    setType(cat.type);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("กรุณาใส่ชื่อหมวดหมู่");
      return;
    }
    setSaving(true);

    const payload = { name: name.trim(), icon, color, type };

    try {
      if (editId) {
        const res = await fetch(`/api/categories/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("แก้ไขหมวดหมู่แล้ว! ✏️");
          resetForm();
          fetchCategories();
        } else {
          toast.error("แก้ไขไม่สำเร็จ");
        }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("เพิ่มหมวดหมู่แล้ว! 🎉");
          resetForm();
          fetchCategories();
        } else {
          toast.error("เพิ่มไม่สำเร็จ");
        }
      }
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบหมวดหมู่นี้?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("ลบหมวดหมู่แล้ว");
        fetchCategories();
      } else {
        toast.error("ลบไม่สำเร็จ (อาจมีรายการที่ใช้อยู่)");
      }
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const filtered = categories.filter(
    (c) => filter === "all" || c.type === filter
  );

  if (loading) {
    return (
      <AppLayout title="หมวดหมู่">
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-sakura" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="หมวดหมู่">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-ink/50">
            หมวดหมู่ทั้งหมด ({categories.length})
          </p>
          <Button
            size="sm"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <Plus className="w-4 h-4" /> เพิ่มหมวดหมู่
          </Button>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(["all", "expense", "income"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm border transition-all ${
                filter === f
                  ? "bg-sakura/20 border-sakura text-sakura-dark"
                  : "bg-white border-sakura/20 text-ink/50"
              }`}
            >
              {f === "all" ? "ทั้งหมด" : f === "expense" ? "รายจ่าย" : "รายรับ"}
            </button>
          ))}
        </div>

        {/* Create / Edit Form */}
        {showForm && (
          <Card className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-ink text-sm">
                {editId ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
              </p>
              <button onClick={resetForm}>
                <X className="w-4 h-4 text-ink/40" />
              </button>
            </div>

            <Input
              label="ชื่อหมวดหมู่"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น อาหาร, เงินเดือน"
            />

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                ประเภท
              </label>
              <div className="flex gap-2">
                {(["expense", "income"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${
                      type === t
                        ? "bg-sakura/20 border-sakura text-sakura-dark"
                        : "bg-white border-sakura/20 text-ink/50"
                    }`}
                  >
                    {t === "expense" ? "รายจ่าย" : "รายรับ"}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                ไอคอน
              </label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIcon(i)}
                    className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition-all ${
                      icon === i
                        ? "bg-sakura/20 border-sakura scale-110"
                        : "bg-white border-sakura/10 hover:border-sakura/30"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">
                สี
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      color === c
                        ? "border-ink scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving
                ? "กำลังบันทึก..."
                : editId
                ? "บันทึกการแก้ไข"
                : "เพิ่มหมวดหมู่"}
            </Button>
          </Card>
        )}

        {/* Category List */}
        <div className="grid gap-3">
          {filtered.map((cat) => (
            <Card key={cat.id} className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                style={{ backgroundColor: `${cat.color}30` }}
              >
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink text-sm truncate">
                  {cat.name}
                </p>
                <Badge
                  className={
                    cat.type === "income"
                      ? "bg-matcha/20 text-matcha-dark"
                      : "bg-sakura/20 text-sakura-dark"
                  }
                >
                  {cat.type === "income" ? "รายรับ" : "รายจ่าย"}
                </Badge>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-2 rounded-xl hover:bg-cream transition-colors"
                >
                  <Pencil className="w-4 h-4 text-ink/40" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-ink/40 py-8">
              {filter === "all"
                ? "ยังไม่มีหมวดหมู่ กดเพิ่มหมวดหมู่แรกของคุณ!"
                : "ไม่มีหมวดหมู่ในประเภทนี้"}
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
