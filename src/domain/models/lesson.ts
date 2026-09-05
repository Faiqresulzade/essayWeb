import type { EssayGrade, LessonSlideType } from './enums';

export interface LessonExample {
  readonly en: string;
  readonly az: string;
  /** `en` cümləsinin hərfi alt-sətri; tapılmasa vurğulama edilmir. */
  readonly highlight: string | null;
}

export interface LessonMistake {
  readonly wrong: string;
  readonly correct: string;
  readonly note: string;
}

export interface LessonComparison {
  readonly leftTitle: string;
  readonly leftBody: string;
  readonly rightTitle: string;
  readonly rightBody: string;
}

export interface LessonSlide {
  readonly type: LessonSlideType;
  readonly title: string;
  readonly body: string | null;
  readonly formula: string | null;
  readonly keywords: readonly string[];
  readonly examples: readonly LessonExample[];
  readonly mistakes: readonly LessonMistake[];
  readonly comparison: LessonComparison | null;
  readonly points: readonly string[];
}

export interface LessonQuizQuestion {
  readonly question: string;
  readonly options: readonly string[];
  /** Zəmanət: 0 <= correctIndex < options.length. Variantlar YENİDƏN QARIŞDIRILMIR. */
  readonly correctIndex: number;
  readonly explanation: string;
}

export interface LessonSummary {
  readonly id: number;
  readonly topic: string;
  readonly grade: EssayGrade;
  readonly createdByName: string;
  readonly isMine: boolean;
  readonly slideCount: number;
  readonly createdAt: string;
}

export interface Lesson extends Omit<LessonSummary, 'slideCount'> {
  readonly slides: readonly LessonSlide[];
  readonly quiz: readonly LessonQuizQuestion[];
}

export interface LessonPage {
  readonly items: readonly LessonSummary[];
  readonly totalCount: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}

export interface LessonLibraryQuery {
  readonly search?: string;
  readonly grade?: EssayGrade;
  readonly mine?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

export interface CreateLessonCommand {
  readonly topic: string;
  readonly grade: EssayGrade;
}
