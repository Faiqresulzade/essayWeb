import type { ScoreTone } from '@/domain';

/** Semantik tonların CSS dəyişənləri — bal rəngi qaydası (§3.2) tək yerdən idarə olunur. */
export const TONE_COLOR: Readonly<Record<ScoreTone, string>> = {
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
};

export const TONE_BACKGROUND: Readonly<Record<ScoreTone, string>> = {
  success: 'var(--color-success-bg)',
  warning: 'var(--color-warning-bg)',
  danger: 'var(--color-danger-bg)',
};
