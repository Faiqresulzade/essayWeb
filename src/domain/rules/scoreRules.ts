import type { ScoreDirection } from '../models/enums';
import { SCORE_DIRECTIONS } from '../models/enums';

/** DİM meyarlarının maksimum balları — `Content` digərlərindən fərqlidir. */
export const DIRECTION_MAX_SCORE: Readonly<Record<ScoreDirection, number>> = {
  Structure: 1,
  Content: 2,
  Grammar: 1,
  Vocabulary: 1,
};

export const TOTAL_MAX_SCORE = 5;

export type ScoreTone = 'success' | 'warning' | 'danger';

const GOOD_RATIO = 0.8;
const FAIR_RATIO = 0.5;

export function scoreRatio(score: number, max = TOTAL_MAX_SCORE): number {
  if (max <= 0) return 0;
  return clamp01(score / max);
}

/**
 * Bal rəngi qaydası — bal göstərilən HƏR yerdə eyni işlədilir.
 * ≥80% yaşıl, ≥50% sarı, qalanı qırmızı.
 */
export function scoreTone(score: number, max = TOTAL_MAX_SCORE): ScoreTone {
  const ratio = scoreRatio(score, max);
  if (ratio >= GOOD_RATIO) return 'success';
  if (ratio >= FAIR_RATIO) return 'warning';
  return 'danger';
}

export function toPercent(score: number, max: number): number {
  return Math.round(scoreRatio(score, max) * 100);
}

/**
 * Ən zəif istiqamət — xam `average` yox, `percent` üzrə hesablanır,
 * çünki maksimum ballar fərqlidir.
 */
export function weakestDirectionOf(
  entries: readonly { direction: ScoreDirection; percent: number }[],
): ScoreDirection | null {
  const [first, ...rest] = entries;
  if (!first) return null;
  return rest.reduce((weakest, entry) => (entry.percent < weakest.percent ? entry : weakest), first)
    .direction;
}

export function isKnownDirection(value: string): value is ScoreDirection {
  return (SCORE_DIRECTIONS as readonly string[]).includes(value);
}

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}
