import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-sakura/20 text-sakura-dark",
    success: "bg-mint/20 text-green-700",
    warning: "bg-peach/20 text-amber-700",
    danger: "bg-red-100 text-red-600",
    info: "bg-lavender/20 text-purple-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
