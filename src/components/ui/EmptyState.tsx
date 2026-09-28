import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-tile text-ink-faint">{icon}</div>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      {description && <p className="mt-1.5 max-w-xs text-sm text-ink-muted">{description}</p>}
      {action &&
        (action.href ? (
          <Link href={action.href} className="btn-primary mt-6 px-6">
            {action.label}
          </Link>
        ) : (
          <button onClick={action.onClick} className="btn-primary mt-6 px-6">
            {action.label}
          </button>
        ))}
    </div>
  );
}
