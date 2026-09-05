import type { EssayGrade, LessonSlideType } from '@/domain';

export interface LessonExampleDto {
  en: string;
  az: string;
  highlight: string | null;
}

export interface LessonMistakeDto {
  wrong: string;
  correct: string;
  note: string;
}

export interface LessonComparisonDto {
  leftTitle: string;
  leftBody: string;
  rightTitle: string;
  rightBody: string;
}

export interface LessonSlideDto {
  type: LessonSlideType;
  title: string;
  body: string | null;
  formula: string | null;
  keywords: string[];
  examples: LessonExampleDto[];
  mistakes: LessonMistakeDto[];
  comparison: LessonComparisonDto | null;
  points: string[];
}

export interface LessonQuizQuestionDto {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonResponseDto {
  id: number;
  topic: string;
  grade: EssayGrade;
  createdByName: string;
  isMine: boolean;
  createdAt: string;
  slides: LessonSlideDto[];
  quiz: LessonQuizQuestionDto[];
}

export interface LessonListItemDto {
  id: number;
  topic: string;
  grade: EssayGrade;
  createdByName: string;
  isMine: boolean;
  slideCount: number;
  createdAt: string;
}

export interface LessonListResponseDto {
  items: LessonListItemDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
