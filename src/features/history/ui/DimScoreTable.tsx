import type { EssayScores } from '@/domain';
import { scoreTone } from '@/domain';
import { directionLabel } from '@/shared/i18n/labels';
import { strings } from '@/shared/i18n/strings';
import { formatScore } from '@/shared/lib/format';
import { TONE_COLOR } from '@/shared/ui/tone';

interface DimScoreTableProps {
  readonly scores: EssayScores;
}

export function DimScoreTable({ scores }: DimScoreTableProps) {
  return (
    <div className="space-y-3">
      <ul className="space-y-3">
        {scores.directions.map(direction => (
          <li
            key={direction.direction}
            className="print-block border-b border-[var(--color-border)] pb-3 last:border-none last:pb-0"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold">{directionLabel(direction.direction)}</span>
              <span
                className="font-bold whitespace-nowrap"
                style={{ color: TONE_COLOR[scoreTone(direction.score, direction.max)] }}
              >
                {formatScore(direction.score)} / {direction.max}
              </span>
            </div>
            {direction.comment && (
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{direction.comment}</p>
            )}
          </li>
        ))}
      </ul>
      <p className="text-xs text-[var(--color-text-muted)]">
        {strings.historyDetail.dimDisclaimer}
      </p>
    </div>
  );
}
