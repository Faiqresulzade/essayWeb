import { AlertTriangle, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { strings } from '@/shared/i18n/strings';

import { Button } from './primitives/button';
import { Skeleton } from './primitives/skeleton';

interface PageHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly actions?: ReactNode;
  readonly className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-wrap items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <h1 className="truncate">{title}</h1>
        {subtitle && <p className="mt-1 text-[var(--color-text-muted)]">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

interface EmptyStateProps {
  readonly icon?: LucideIcon;
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly className?: string;
}

/** Hər ekranda boş vəziyyət izahlı olmalıdır — sadə spinner qadağandır. */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-card px-6 py-12 text-center',
        className,
      )}
    >
      {Icon && (
        <span className="flex size-14 items-center justify-center rounded-full bg-gradient-brand text-white">
          <Icon className="size-6" aria-hidden />
        </span>
      )}
      <div>
        <h3>{title}</h3>
        {description && (
          <p className="mt-1 max-w-md text-[var(--color-text-muted)]">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

interface ErrorBannerProps {
  readonly message: string;
  readonly onRetry?: () => void;
  readonly onDismiss?: () => void;
  readonly className?: string;
}

export function ErrorBanner({ message, onRetry, onDismiss, className }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-card border px-4 py-3',
        'border-[var(--color-danger)]/30 bg-[var(--color-danger-bg)]',
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--color-danger)]" aria-hidden />
      <p className="flex-1 text-[var(--color-text)]">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {strings.common.retry}
        </Button>
      )}
      {onDismiss && (
        <Button variant="ghost" size="sm" onClick={onDismiss} aria-label={strings.common.close}>
          ✕
        </Button>
      )}
    </div>
  );
}

interface ListSkeletonProps {
  readonly rows?: number;
  readonly className?: string;
}

export function ListSkeleton({ rows = 4, className }: ListSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)} aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-20 w-full rounded-card" />
      ))}
    </div>
  );
}

export function FullScreenLoader() {
  return (
    <div className="flex min-h-dvh flex-col gap-4 p-6" aria-busy="true">
      <Skeleton className="h-10 w-48 rounded-card" />
      <Skeleton className="h-64 w-full rounded-card" />
      <Skeleton className="h-32 w-full rounded-card" />
    </div>
  );
}
