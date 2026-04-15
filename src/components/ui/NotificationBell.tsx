"use client";

import { Bell } from "lucide-react";
import Link from "next/link";

interface NotificationBellProps {
  unreadCount: number;
}

export function NotificationBell({ unreadCount }: NotificationBellProps) {
  return (
    <Link href="/notifications" className="relative p-2 rounded-full hover:bg-sakura/10 transition-colors">
      <Bell className="w-5 h-5 text-ink/70 dark:text-ink-dark/70" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
