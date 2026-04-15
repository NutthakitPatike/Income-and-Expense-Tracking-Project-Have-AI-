"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { defaultCategories } from "@/lib/mock-data";
import {
  Wallet,
  Building2,
  Smartphone,
  Check,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import toast from "react-hot-toast";

const currencies = [
  { code: "THB", symbol: "฿", name: "บาท" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "JPY", symbol: "¥", name: "Yen" },
];

const accountTypes = [
  { type: "cash", label: "เงินสด", icon: Wallet, color: "bg-peach/30 text-amber-600" },
  { type: "bank", label: "ธนาคาร", icon: Building2, color: "bg-mint/30 text-green-600" },
  { type: "wallet", label: "E-Wallet", icon: Smartphone, color: "bg-lavender/30 text-purple-600" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("THB");
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("cash");
  const [accountBalance, setAccountBalance] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    defaultCategories.map((c) => c.name)
  );

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleFinish = () => {
    // TODO: Save onboarding data to DB
    toast.success("พร้อมใช้งานแล้ว! 🎉");
    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                s === step ? "w-8 bg-sakura" : s < step ? "w-8 bg-mint" : "w-8 bg-sakura/20"
              )}
            />
          ))}
        </div>

        {/* Step 1: Name & Currency */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-3">🍡</div>
              <h2 className="text-2xl font-bold text-ink">สวัสดี! เริ่มกันเลย</h2>
              <p className="text-ink/50 text-sm mt-1">บอกชื่อของคุณและเลือกสกุลเงิน</p>
            </div>
            <Input
              label="ชื่อของคุณ"
              placeholder="Mochi"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-2">สกุลเงิน</label>
              <div className="grid grid-cols-2 gap-2">
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-medium transition-all",
                      currency === c.code
                        ? "border-sakura bg-sakura/10 text-sakura-dark"
                        : "border-sakura/20 bg-white text-ink/60 hover:bg-cream"
                    )}
                  >
                    <span className="text-lg">{c.symbol}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={() => setStep(2)} className="w-full">
              ต่อไป <ChevronRight className="w-4 h-4" />
            </Button>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full text-center text-sm text-ink/40 hover:text-ink/60"
            >
              ข้ามไปก่อน
            </button>
          </div>
        )}

        {/* Step 2: First Account */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-3">💰</div>
              <h2 className="text-2xl font-bold text-ink">สร้างบัญชีแรก</h2>
              <p className="text-ink/50 text-sm mt-1">เลือกประเภทบัญชีที่คุณใช้บ่อย</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {accountTypes.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.type}
                    onClick={() => setAccountType(a.type)}
                    className={cn(
                      "flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border transition-all",
                      accountType === a.type
                        ? "border-sakura bg-sakura/10"
                        : "border-sakura/20 bg-white hover:bg-cream"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", a.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-ink">{a.label}</span>
                  </button>
                );
              })}
            </div>
            <Input
              label="ชื่อบัญชี"
              placeholder="เช่น กระเป๋าเงินสด, ธนาคารกสิกร"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
            <Input
              label="ยอดเงินปัจจุบัน"
              type="number"
              placeholder="0"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                <ChevronLeft className="w-4 h-4" /> กลับ
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                ต่อไป <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Categories */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-5xl mb-3">🏷️</div>
              <h2 className="text-2xl font-bold text-ink">เลือกหมวดหมู่</h2>
              <p className="text-ink/50 text-sm mt-1">เลือกหมวดหมู่ที่คุณใช้บ่อย (แก้ไขทีหลังได้)</p>
            </div>

            <div>
              <p className="text-sm font-medium text-ink/70 mb-2">รายจ่าย</p>
              <div className="flex flex-wrap gap-2">
                {defaultCategories
                  .filter((c) => c.type === "expense")
                  .map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => toggleCategory(cat.name)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm border transition-all",
                        selectedCategories.includes(cat.name)
                          ? "border-sakura bg-sakura/10 text-sakura-dark"
                          : "border-sakura/20 bg-white text-ink/50 hover:bg-cream"
                      )}
                    >
                      {selectedCategories.includes(cat.name) && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      {cat.name}
                    </button>
                  ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-ink/70 mb-2">รายรับ</p>
              <div className="flex flex-wrap gap-2">
                {defaultCategories
                  .filter((c) => c.type === "income")
                  .map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => toggleCategory(cat.name)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm border transition-all",
                        selectedCategories.includes(cat.name)
                          ? "border-mint bg-mint/10 text-green-700"
                          : "border-sakura/20 bg-white text-ink/50 hover:bg-cream"
                      )}
                    >
                      {selectedCategories.includes(cat.name) && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      {cat.name}
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
                <ChevronLeft className="w-4 h-4" /> กลับ
              </Button>
              <Button onClick={handleFinish} className="flex-1">
                เริ่มใช้งาน! 🎉
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
