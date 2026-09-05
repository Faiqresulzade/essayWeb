import type { AnalyticsScores, ScoreDirection } from '@/domain';
import { directionLabel } from '@/shared/i18n/labels';
import { strings } from '@/shared/i18n/strings';
import { formatDecimal, formatPercent } from '@/shared/lib/format';

interface DirectionBarsProps {
  readonly scores: AnalyticsScores;
  readonly weakestDirection: ScoreDirection | null;
}

/**
 * İstiqamətlərin maksimum balları fərqlidir (Content = 2.0), ona görə
 * müqayisə `percent` üzərindən aparılır — xam `average` yalnız mətn kimi göstərilir.
 */
export function DirectionBars({ scores, weakestDirection }: DirectionBarsProps) {
  return (
    <div className="space-y-4">
      {scores.directions.map(direction => {
        const isWeakest = direction.direction === weakestDirection;
        const color = isWeakest ? 'var(--color-warning)' : 'var(--color-brand)';

        return (
          <div key={direction.direction} className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-medium">
                {directionLabel(direction.direction)}
                {isWeakest && (
                  <span className="rounded-chip bg-[var(--color-warning-bg)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-warning)]">
                    {strings.analytics.weakestBadge}
                  </span>
                )}
              </span>
              <span className="text-sm font-semibold">{formatPercent(direction.percent)}</span>
            </div>

            <div
              className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-variant)]"
              role="img"
              aria-label={`${directionLabel(direction.direction)}: ${formatPercent(direction.percent)}`}
            >
              <div
                className="h-full rounded-full transition-[width]"
                style={{
                  width: `${Math.min(100, Math.max(0, direction.percent))}%`,
                  backgroundColor: color,
                }}
              />
            </div>

            <p className="text-xs text-[var(--color-text-muted)]">
              {formatDecimal(direction.average, 2)} / {formatDecimal(direction.max, 1)}
            </p>
          </div>
        );
      })}

      <p className="text-xs text-[var(--color-text-muted)]">{strings.analytics.directionsHint}</p>
    </div>
  );
}
