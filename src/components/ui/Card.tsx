import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, onClick, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-[#333330] rounded-2xl shadow-sm border border-sakura/20 dark:border-sakura/10 p-4",
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-3", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("font-semibold text-ink dark:text-ink-dark text-base", className)}>{children}</h3>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("", className)}>{children}</div>;
}
