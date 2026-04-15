"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Users, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BillItem {
  id: string;
  name: string;
  amount: number;
}

interface Friend {
  id: string;
  name: string;
}

export default function SplitBillPage() {
  const [billName, setBillName] = useState("");
  const [items, setItems] = useState<BillItem[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [newFriendName, setNewFriendName] = useState("");

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const perPerson = friends.length > 0 ? totalAmount / (friends.length + 1) : totalAmount;

  const addItem = () => {
    if (!newItemName || !newItemAmount) return;
    setItems([...items, { id: Date.now().toString(), name: newItemName, amount: parseFloat(newItemAmount) }]);
    setNewItemName("");
    setNewItemAmount("");
  };

  const addFriend = () => {
    if (!newFriendName) return;
    setFriends([...friends, { id: Date.now().toString(), name: newFriendName }]);
    setNewFriendName("");
  };

  return (
    <AppLayout title="หารบิล">
      <div className="space-y-4">
        <Input
          label="ชื่อบิล"
          placeholder="เช่น มื้อเย็นวันศุกร์"
          value={billName}
          onChange={(e) => setBillName(e.target.value)}
        />

        {/* Items */}
        <Card>
          <h3 className="font-semibold text-ink text-sm mb-3">รายการค่าใช้จ่าย</h3>
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-sakura/10 last:border-0">
              <span className="text-sm text-ink">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink">{formatCurrency(item.amount)}</span>
                <button onClick={() => setItems(items.filter((i) => i.id !== item.id))} className="p-1 hover:bg-red-50 rounded-full">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex gap-2 mt-3">
            <Input placeholder="ชื่อรายการ" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
            <Input placeholder="จำนวนเงิน" type="number" value={newItemAmount} onChange={(e) => setNewItemAmount(e.target.value)} className="w-28" />
            <Button size="sm" onClick={addItem}><Plus className="w-4 h-4" /></Button>
          </div>
        </Card>

        {/* Friends */}
        <Card>
          <h3 className="font-semibold text-ink text-sm mb-3">
            <Users className="w-4 h-4 inline mr-1" /> เพื่อนที่ร่วมหาร
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1.5 bg-sakura/20 rounded-full text-xs font-medium text-sakura-dark">คุณ</span>
            {friends.map((f) => (
              <span key={f.id} className="px-3 py-1.5 bg-lavender/20 rounded-full text-xs font-medium text-purple-700 flex items-center gap-1">
                {f.name}
                <button onClick={() => setFriends(friends.filter((fr) => fr.id !== f.id))}>×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="ชื่อเพื่อน" value={newFriendName} onChange={(e) => setNewFriendName(e.target.value)} />
            <Button size="sm" variant="secondary" onClick={addFriend}><Plus className="w-4 h-4" /></Button>
          </div>
        </Card>

        {/* Summary */}
        {items.length > 0 && (
          <Card className="bg-gradient-to-r from-mint/20 to-lavender/20 border-none">
            <div className="text-center">
              <p className="text-sm text-ink/60">ยอดรวม</p>
              <p className="text-2xl font-bold text-ink">{formatCurrency(totalAmount)}</p>
              <p className="text-sm text-ink/50 mt-1">
                คนละ <span className="font-bold text-ink">{formatCurrency(perPerson)}</span> ({friends.length + 1} คน)
              </p>
            </div>
            <Button className="w-full mt-3">บันทึกเป็นรายการ</Button>
          </Card>
        )}

        {items.length === 0 && (
          <EmptyState icon="🧾" title="ยังไม่มีรายการ" description="เพิ่มรายการค่าใช้จ่ายแล้วเริ่มหารบิลกัน!" />
        )}
      </div>
    </AppLayout>
  );
}
