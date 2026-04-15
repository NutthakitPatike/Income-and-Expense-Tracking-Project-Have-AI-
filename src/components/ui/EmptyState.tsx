interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function EmptyState({ icon = "🍡", title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-ink dark:text-ink-dark mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-ink/50 dark:text-ink-dark/50 max-w-xs">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
