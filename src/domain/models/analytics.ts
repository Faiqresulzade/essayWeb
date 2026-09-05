import type { EssayGrade, MistakeCategory, ScoreDirection } from './enums';

export interface DirectionScore {
  readonly direction: ScoreDirection;
  readonly average: number;
  /** Content = 2.0, qalanları = 1.0 — ona görə müqayisə `percent` ilə aparılır. */
  readonly max: number;
  readonly percent: number;
}

export interface AnalyticsScores {
  readonly total: number;
  readonly totalPercent: number;
  readonly directions: readonly DirectionScore[];
}

export interface MistakeCategoryStat {
  readonly category: MistakeCategory;
  readonly count: number;
  readonly share: number;
}

export interface AnalyticsMistakes {
  readonly total: number;
  readonly averagePerEssay: number;
  /** Şagirdləri müqayisə edərkən BU işlədilir (esse uzunluğundan asılı deyil). */
  readonly perHundredWords: number;
  readonly categories: readonly MistakeCategoryStat[];
}

export interface AnalyticsInsight {
  readonly text: string;
  readonly count: number;
}

export interface StudentTrendPoint {
  readonly essayId: number;
  readonly date: string;
  readonly title: string;
  readonly wordCount: number;
  readonly total: number;
  readonly structure: number;
  readonly content: number;
  readonly grammar: number;
  readonly vocabulary: number;
  readonly mistakeCount: number;
}

interface AnalyticsReport {
  /** Ən azı 2 esse varmı — trend qrafiki yalnız `true` olduqda çəkilir. */
  readonly hasEnoughData: boolean;
  readonly essayCount: number;
  readonly scores: AnalyticsScores;
  readonly weakestDirection: ScoreDirection | null;
  readonly mistakes: AnalyticsMistakes;
}

export interface StudentAnalytics extends AnalyticsReport {
  readonly studentId: number;
  readonly fullName: string;
  readonly groupId: number;
  readonly groupName: string;
  readonly grade: EssayGrade | null;
  readonly latestTotal: number | null;
  readonly previousTotal: number | null;
  readonly delta: number | null;
  /** Tarixə görə ARTAN sıra — qrafikə birbaşa verilir. */
  readonly trend: readonly StudentTrendPoint[];
  readonly weaknesses: readonly AnalyticsInsight[];
  readonly recommendations: readonly AnalyticsInsight[];
}

export interface GroupAnalyticsStudent {
  readonly studentId: number;
  readonly fullName: string;
  /** 0 + essayCount 0 = hələ essesi yoxdur. */
  readonly rank: number;
  readonly essayCount: number;
  readonly averageTotal: number | null;
  readonly latestTotal: number | null;
  readonly delta: number | null;
  readonly weakestDirection: ScoreDirection | null;
}

export interface GroupAnalytics extends AnalyticsReport {
  readonly groupId: number;
  readonly name: string;
  readonly studentCount: number;
  /** Backend-dən ARTIQ SIRALANMIŞ gəlir — yenidən sortlanmır. */
  readonly students: readonly GroupAnalyticsStudent[];
}

export interface OverviewGroupSummary {
  readonly groupId: number;
  readonly name: string;
  readonly studentCount: number;
  readonly essayCount: number;
  readonly averageTotal: number | null;
}

export interface OverviewAnalytics extends AnalyticsReport {
  readonly groupCount: number;
  readonly studentCount: number;
  readonly essaysWithStudent: number;
  readonly essaysLast30Days: number;
  readonly weaknesses: readonly AnalyticsInsight[];
  readonly recommendations: readonly AnalyticsInsight[];
  readonly groups: readonly OverviewGroupSummary[];
}
