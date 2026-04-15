"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bell, CheckCheck, AlertTriangle, Target, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const iconMap: Record<string, React.ReactNode> = {
  budget_warning: <AlertTriangle className="w-5 h-5 text-peach" />,
  goal_deadline: <Target className="w-5 h-5 text-mint" />,
  system: <Bell className="w-5 h-5 text-lavender" />,
};

interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    fetch("/api/notifications").then((r) => r.json()).then((d) => {
      setNotifications(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchNotifs(); }, []);

  const markAllRead = async () => {
    const res = await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    if (res.ok) {
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      toast.success("อ่านทั้งหมดแล้ว");
    }
  };

  if (loading) {
    return <AppLayout title="แจ้งเตือน"><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sakura" /></div></AppLayout>;
  }

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

        {notifications.length === 0 ? (
          <p className="text-center text-ink/40 py-8">ไม่มีการแจ้งเตือน</p>
        ) : (
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
        )}
      </div>
    </AppLayout>
  );
}
