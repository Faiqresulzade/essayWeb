import { scoreTone, TOTAL_MAX_SCORE } from '@/domain';
import { cn } from '@/shared/lib/cn';
import { formatScore } from '@/shared/lib/format';

import { TONE_BACKGROUND, TONE_COLOR } from './tone';

type ScoreBadgeSize = 'sm' | 'md' | 'lg';

interface ScoreBadgeProps {
  readonly score: number;
  readonly max?: number;
  readonly size?: ScoreBadgeSize;
  readonly className?: string;
}

const SIZE_CLASSES: Readonly<Record<ScoreBadgeSize, string>> = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1',
  lg: 'text-2xl px-4 py-2 gap-1.5 font-bold',
};

/** Bal göstərilən hər yerdə eyni rəng qaydası tətbiq olunur. */
export function ScoreBadge({
  score,
  max = TOTAL_MAX_SCORE,
  size = 'md',
  className,
}: ScoreBadgeProps) {
  const tone = scoreTone(score, max);

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-chip font-semibold whitespace-nowrap',
        SIZE_CLASSES[size],
        className,
      )}
      style={{ color: TONE_COLOR[tone], backgroundColor: TONE_BACKGROUND[tone] }}
    >
      {formatScore(score)}
      <span className="opacity-70">/ {max}</span>
    </span>
  );
}
