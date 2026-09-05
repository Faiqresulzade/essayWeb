import type { EssayGrade, EssaySource, MistakeCategory, ScoreDirection } from './enums';

export interface EssayMistake {
  readonly wrong: string;
  readonly correct: string;
  readonly category: MistakeCategory;
  readonly reason: string;
}

export type EssayMistakeCounts = Readonly<Record<MistakeCategory, number>> & {
  readonly total: number;
};

export interface EssayDirectionScore {
  readonly direction: ScoreDirection;
  readonly score: number;
  readonly max: number;
  readonly comment: string;
}

export interface EssayScores {
  readonly directions: readonly EssayDirectionScore[];
  readonly total: number;
}

export interface EssayFeedback {
  readonly strengths: readonly string[];
  readonly weaknesses: readonly string[];
  readonly recommendations: readonly string[];
}

/** Tarixçə siyahısındakı yüngül element (slayd/səhv detalı yoxdur). */
export interface EssaySummary {
  readonly id: number;
  readonly title: string;
  readonly createdAt: string;
  readonly wordCount: number;
  readonly totalScore: number;
  readonly grade: EssayGrade;
  readonly studentId: number | null;
  readonly studentName: string | null;
}

export interface Essay extends EssaySummary {
  readonly source: EssaySource;
  readonly accuracyPercent: number;
  /** `<b>...</b>` işarələnmiş mətn — HTML kimi render EDİLMİR, parçalanır. */
  readonly correctedEssay: string;
  readonly statistics: EssayMistakeCounts;
  readonly mistakes: readonly EssayMistake[];
  readonly scores: EssayScores;
  readonly feedback: EssayFeedback;
}

export interface EssayHistoryPage {
  readonly items: readonly EssaySummary[];
  readonly totalCount: number;
  readonly averageScore: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}

export interface EssayHistoryQuery {
  readonly search?: string;
  readonly studentId?: number;
  readonly groupId?: number;
  readonly page?: number;
  readonly pageSize?: number;
}

/** Grade11 — adi mətn qiymətləndirməsi. */
export interface EvaluateTextEssayCommand {
  readonly text: string;
  readonly title?: string;
  readonly source: EssaySource;
  readonly grade?: EssayGrade;
  readonly topic?: string;
  readonly studentId?: number;
}

/** Grade9 — DİM formatı: mətn + opsional tapşırıq şəkli. */
export interface EvaluateGrade9EssayCommand {
  readonly text: string;
  readonly title?: string;
  readonly studentId?: number;
  readonly promptImage?: File;
}
