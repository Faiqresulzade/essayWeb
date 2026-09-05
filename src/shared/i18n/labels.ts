import type { EssayGrade, MistakeCategory, ScoreDirection } from '@/domain';

import { strings } from './strings';

/** Enum → Azərbaycan dilində etiket. Bütün ekranlarda eyni ad işlədilir. */
export function gradeLabel(grade: EssayGrade | null | undefined): string {
  if (grade === 'Grade9') return strings.essay.grade9;
  if (grade === 'Grade11') return strings.essay.grade11;
  return strings.students.gradeNotSet;
}

export function directionLabel(direction: ScoreDirection): string {
  return strings.analytics.directions[direction];
}

export function categoryLabel(category: MistakeCategory): string {
  return strings.analytics.categories[category];
}

/** Səhv kateqoriyalarının rəngləri (donut və statistika kartları üçün). */
export const CATEGORY_COLOR: Readonly<Record<MistakeCategory, string>> = {
  Grammar: 'var(--color-danger)',
  Spelling: 'var(--color-warning)',
  Vocabulary: 'var(--color-info)',
  NaturalExpression: 'var(--color-success)',
};
