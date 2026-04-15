"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-sakura hover:bg-sakura-dark text-white shadow-sm",
    secondary: "bg-white dark:bg-[#333330] hover:bg-cream dark:hover:bg-[#3a3a37] border border-sakura/30 dark:border-sakura/20 text-ink dark:text-ink-dark",
    ghost: "bg-transparent hover:bg-sakura/10 text-ink dark:text-ink-dark",
    danger: "bg-red-400 hover:bg-red-500 text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        "font-semibold rounded-2xl transition-all duration-200 active:scale-95 inline-flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        (disabled || loading) && "opacity-60 cursor-not-allowed active:scale-100",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
