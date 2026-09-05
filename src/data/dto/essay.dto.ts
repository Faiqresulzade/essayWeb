import type { EssayGrade, EssaySource, MistakeCategory } from '@/domain';

export interface EssayStatisticsDto {
  grammar: number;
  spelling: number;
  vocabulary: number;
  naturalExpression: number;
  total: number;
}

export interface EssayMistakeDto {
  wrong: string;
  correct: string;
  category: MistakeCategory;
  reason: string;
}

export interface EssayScoresDto {
  structure: number;
  structureComment: string;
  content: number;
  contentComment: string;
  grammar: number;
  grammarComment: string;
  vocabulary: number;
  vocabularyComment: string;
  total: number;
}

export interface EssayFeedbackDto {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface EssayDetailResponseDto {
  id: number;
  title: string;
  createdAt: string;
  source: EssaySource;
  grade: EssayGrade;
  wordCount: number;
  accuracyPercent: number;
  totalScore: number;
  correctedEssay: string;
  statistics: EssayStatisticsDto;
  mistakes: EssayMistakeDto[];
  scores: EssayScoresDto;
  feedback: EssayFeedbackDto;
  studentId: number | null;
  studentName: string | null;
}

export interface EssayHistoryItemDto {
  id: number;
  title: string;
  createdAt: string;
  wordCount: number;
  totalScore: number;
  grade: EssayGrade;
  studentId: number | null;
  studentName: string | null;
}

export interface EssayHistoryResponseDto {
  items: EssayHistoryItemDto[];
  totalCount: number;
  averageScore: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OcrResponseDto {
  text: string;
}

export interface DeleteAllHistoryResponseDto {
  deleted: number;
}
