"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Target,
  BarChart3,
  Wallet,
  Receipt,
  Upload,
  Bell,
  Settings,
  X,
  Tags,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "รายการ", icon: ArrowLeftRight },
  { href: "/budget", label: "งบประมาณ", icon: PiggyBank },
  { href: "/goals", label: "เป้าหมาย", icon: Target },
  { href: "/reports", label: "รายงาน", icon: BarChart3 },
  { href: "/accounts", label: "บัญชี", icon: Wallet },
  { href: "/categories", label: "หมวดหมู่", icon: Tags },
  { href: "/split-bill", label: "หารบิล", icon: Receipt },
  { href: "/import", label: "นำเข้า", icon: Upload },
  { href: "/notifications", label: "แจ้งเตือน", icon: Bell },
  { href: "/settings", label: "ตั้งค่า", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-sakura/20 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sakura/10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🍡</span>
            <span className="font-bold text-lg text-ink">Money Mochi</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 rounded-full hover:bg-cream">
            <X className="w-5 h-5 text-ink/50" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="px-3 py-4 space-y-1 overflow-y-auto h-[calc(100%-65px)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-sakura/20 text-sakura-dark"
                    : "text-ink/60 hover:bg-cream hover:text-ink"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
