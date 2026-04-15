"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mockNotifications } from "@/lib/mock-data";
import { Bell, CheckCheck, AlertTriangle, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  budget_warning: <AlertTriangle className="w-5 h-5 text-peach" />,
  goal_deadline: <Target className="w-5 h-5 text-mint" />,
  system: <Bell className="w-5 h-5 text-lavender" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <AppLayout title="แจ้งเตือน">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-ink/50">
            {notifications.filter((n) => !n.isRead).length} รายการที่ยังไม่อ่าน
          </p>
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4" /> อ่านทั้งหมด
          </Button>
        </div>

        <div className="space-y-2">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={cn(
                "flex items-start gap-3 transition-all",
                !notif.isRead && "bg-sakura/5 border-sakura/30"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center flex-shrink-0">
                {iconMap[notif.type] || <Bell className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className={cn("text-sm", !notif.isRead ? "font-semibold text-ink" : "text-ink/70")}>
                  {notif.message}
                </p>
                <p className="text-xs text-ink/40 mt-1">
                  {new Date(notif.createdAt).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {!notif.isRead && (
                <div className="w-2 h-2 rounded-full bg-sakura flex-shrink-0 mt-2" />
              )}
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
