import { TrendingDown, TrendingUp } from 'lucide-react';

import type { AnalyticsInsight } from '@/domain';
import { strings } from '@/shared/i18n/strings';
import { cn } from '@/shared/lib/cn';
import { formatDecimal } from '@/shared/lib/format';

interface DeltaBadgeProps {
  readonly delta: number | null;
  readonly className?: string;
}

/** ▲ +0.7 / ▼ -0.5 / — 0.0. `null` olduqda heç nə render olunmur. */
export function DeltaBadge({ delta, className }: DeltaBadgeProps) {
  if (delta === null) return null;

  const positive = delta > 0;
  const negative = delta < 0;
  const color = positive
    ? 'var(--color-success)'
    : negative
      ? 'var(--color-danger)'
      : 'var(--color-text-muted)';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-chip px-2 py-0.5 text-xs font-semibold',
        className,
      )}
      style={{ color, backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)` }}
    >
      {positive && <TrendingUp className="size-3" aria-hidden />}
      {negative && <TrendingDown className="size-3" aria-hidden />}
      {positive ? '+' : ''}
      {formatDecimal(delta)}
    </span>
  );
}

interface InsightListProps {
  readonly items: readonly AnalyticsInsight[];
  readonly tone: 'danger' | 'success';
}

/** Təkrarlanan (count > 1) məqamlar qalın yazılır və nişanlanır. */
export function InsightList({ items, tone }: InsightListProps) {
  if (items.length === 0) return null;
  const color = tone === 'danger' ? 'var(--color-danger)' : 'var(--color-success)';

  return (
    <ul className="space-y-2">
      {items.map(insight => (
        <li key={insight.text} className="flex items-start gap-2 text-sm">
          <span
            className="mt-1.5 size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <span className={cn('flex-1', insight.count > 1 && 'font-semibold')}>{insight.text}</span>
          {insight.count > 1 && (
            <span className="shrink-0 rounded-chip bg-[var(--color-surface-variant)] px-2 py-0.5 text-[11px] text-[var(--color-text-muted)]">
              {strings.analytics.repeatCount(insight.count)}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function NotEnoughData() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-card bg-[var(--color-surface-variant)] px-6 py-10 text-center">
      <span className="text-2xl" aria-hidden>
        📈
      </span>
      <p className="font-semibold">{strings.analytics.notEnoughDataTitle}</p>
      <p className="text-sm text-[var(--color-text-muted)]">
        {strings.analytics.notEnoughDataSubtitle}
      </p>
    </div>
  );
}
