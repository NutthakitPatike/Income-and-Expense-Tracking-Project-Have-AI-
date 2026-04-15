"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { mockUser } from "@/lib/mock-data";
import {
  User,
  Bell,
  Shield,
  Palette,
  Download,
  LogOut,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <AppLayout title="ตั้งค่า">
      <div className="space-y-4">
        {/* Profile Card */}
        <Card className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-sakura/30 flex items-center justify-center text-2xl">
            🍡
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ink">{mockUser.name}</p>
            <p className="text-sm text-ink/40">{mockUser.email}</p>
          </div>
          <button className="p-2 rounded-full hover:bg-cream">
            <ChevronRight className="w-5 h-5 text-ink/40" />
          </button>
        </Card>

        {/* Account Settings */}
        <div>
          <h3 className="text-sm font-semibold text-ink/50 mb-2 px-1">บัญชี</h3>
          <Card className="divide-y divide-sakura/10">
            <div className="flex items-center gap-3 py-3">
              <User className="w-5 h-5 text-sakura" />
              <span className="flex-1 text-sm text-ink">แก้ไขโปรไฟล์</span>
              <ChevronRight className="w-4 h-4 text-ink/30" />
            </div>
            <div className="flex items-center gap-3 py-3">
              <Shield className="w-5 h-5 text-mint" />
              <span className="flex-1 text-sm text-ink">เปลี่ยนรหัสผ่าน</span>
              <ChevronRight className="w-4 h-4 text-ink/30" />
            </div>
          </Card>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-sm font-semibold text-ink/50 mb-2 px-1">การตั้งค่า</h3>
          <Card className="divide-y divide-sakura/10">
            <div className="flex items-center gap-3 py-3">
              <Bell className="w-5 h-5 text-peach" />
              <span className="flex-1 text-sm text-ink">แจ้งเตือน Push</span>
              <button
                onClick={() => {
                  setPushEnabled(!pushEnabled);
                  toast.success(pushEnabled ? "ปิดแจ้งเตือนแล้ว" : "เปิดแจ้งเตือนแล้ว");
                }}
                className={`w-11 h-6 rounded-full transition-all ${
                  pushEnabled ? "bg-mint" : "bg-ink/20"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    pushEnabled ? "translate-x-5.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-3 py-3">
              <Palette className="w-5 h-5 text-lavender" />
              <span className="flex-1 text-sm text-ink">ธีม</span>
              <span className="text-xs text-ink/40">สว่าง</span>
              <ChevronRight className="w-4 h-4 text-ink/30" />
            </div>
            <div className="flex items-center gap-3 py-3">
              <Download className="w-5 h-5 text-sakura" />
              <span className="flex-1 text-sm text-ink">Export ข้อมูล</span>
              <ChevronRight className="w-4 h-4 text-ink/30" />
            </div>
          </Card>
        </div>

        {/* Danger Zone */}
        <div>
          <h3 className="text-sm font-semibold text-ink/50 mb-2 px-1">อื่นๆ</h3>
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

        <p className="text-center text-xs text-ink/30 pt-4">
          Money Mochi v1.0.0 • Made with 🍡
        </p>
      </div>
    </AppLayout>
  );
}
