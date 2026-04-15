"use client";

import { Menu } from "lucide-react";
import { NotificationBell } from "@/components/ui/NotificationBell";

interface NavbarProps {
  onMenuClick: () => void;
  title?: string;
}

export function Navbar({ onMenuClick, title }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-sakura/10 px-4 py-3">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-full hover:bg-cream transition-colors"
          >
            <Menu className="w-5 h-5 text-ink" />
          </button>
          {title && <h1 className="font-bold text-lg text-ink">{title}</h1>}
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell unreadCount={2} />
          <div className="w-8 h-8 rounded-full bg-sakura/30 flex items-center justify-center text-sm font-bold text-sakura-dark">
            M
          </div>
        </div>
      </div>
    </header>
  );
}
