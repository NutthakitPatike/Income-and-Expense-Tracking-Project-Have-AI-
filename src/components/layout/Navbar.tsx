"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { NotificationBell } from "@/components/ui/NotificationBell";

interface NavbarProps {
  onMenuClick: () => void;
  title?: string;
}

export function Navbar({ onMenuClick, title }: NavbarProps) {
  const [unread, setUnread] = useState(0);
  const [initial, setInitial] = useState("?");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          setUnread(d.filter((n: { isRead: boolean }) => !n.isRead).length);
        }
      })
      .catch(() => {});

    fetch("/api/user")
      .then((r) => r.json())
      .then((d) => {
        if (d?.name) setInitial(d.name.charAt(0).toUpperCase());
        else if (d?.email) setInitial(d.email.charAt(0).toUpperCase());
        if (d?.avatar) setAvatar(d.avatar);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#2A2A28]/80 backdrop-blur-md border-b border-sakura/10 dark:border-sakura/5 px-4 py-3">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-full hover:bg-cream dark:hover:bg-[#333330] transition-colors"
          >
            <Menu className="w-5 h-5 text-ink dark:text-ink-dark" />
          </button>
          {title && <h1 className="font-bold text-lg text-ink dark:text-ink-dark">{title}</h1>}
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell unreadCount={unread} />
          <Link href="/settings">
            {avatar ? (
              <img
                src={avatar}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling?.classList.remove("hidden"); }}
              />
            ) : null}
            <div className={`w-8 h-8 rounded-full bg-sakura/30 flex items-center justify-center text-sm font-bold text-sakura-dark ${avatar ? "hidden" : ""}`}>
              {initial}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
