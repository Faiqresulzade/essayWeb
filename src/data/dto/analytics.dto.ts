import type { EssayGrade, MistakeCategory, ScoreDirection } from '@/domain';

export interface DirectionScoreDto {
  direction: ScoreDirection;
  average: number;
  max: number;
  percent: number;
}

export interface AnalyticsScoresDto {
  total: number;
  totalPercent: number;
  directions: DirectionScoreDto[];
}

export interface MistakeCategoryStatDto {
  category: MistakeCategory;
  count: number;
  share: number;
}

export interface AnalyticsMistakesDto {
  total: number;
  averagePerEssay: number;
  perHundredWords: number;
  categories: MistakeCategoryStatDto[];
}

export interface AnalyticsInsightDto {
  text: string;
  count: number;
}

export interface StudentTrendPointDto {
  essayId: number;
  date: string;
  title: string;
  wordCount: number;
  total: number;
  structure: number;
  content: number;
  grammar: number;
  vocabulary: number;
  mistakeCount: number;
}

export interface StudentAnalyticsResponseDto {
  studentId: number;
  fullName: string;
  groupId: number;
  groupName: string;
  grade: EssayGrade | null;
  essayCount: number;
  hasEnoughData: boolean;
  scores: AnalyticsScoresDto;
  weakestDirection: ScoreDirection | null;
  latestTotal: number | null;
  previousTotal: number | null;
  delta: number | null;
  mistakes: AnalyticsMistakesDto;
  trend: StudentTrendPointDto[];
  weaknesses: AnalyticsInsightDto[];
  recommendations: AnalyticsInsightDto[];
}

export interface GroupAnalyticsStudentDto {
  studentId: number;
  fullName: string;
  rank: number;
  essayCount: number;
  averageTotal: number | null;
  latestTotal: number | null;
  delta: number | null;
  weakestDirection: ScoreDirection | null;
}

export interface GroupAnalyticsResponseDto {
  groupId: number;
  name: string;
  studentCount: number;
  essayCount: number;
  hasEnoughData: boolean;
  scores: AnalyticsScoresDto;
  weakestDirection: ScoreDirection | null;
  mistakes: AnalyticsMistakesDto;
  students: GroupAnalyticsStudentDto[];
}

export interface OverviewGroupSummaryDto {
  groupId: number;
  name: string;
  studentCount: number;
  essayCount: number;
  averageTotal: number | null;
}

export interface OverviewAnalyticsResponseDto {
  groupCount: number;
  studentCount: number;
  essayCount: number;
  essaysWithStudent: number;
  essaysLast30Days: number;
  hasEnoughData: boolean;
  scores: AnalyticsScoresDto;
  weakestDirection: ScoreDirection | null;
  mistakes: AnalyticsMistakesDto;
  weaknesses: AnalyticsInsightDto[];
  recommendations: AnalyticsInsightDto[];
  groups: OverviewGroupSummaryDto[];
}
