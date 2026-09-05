import type {
  AnalyticsMistakes,
  AnalyticsScores,
  GroupAnalytics,
  OverviewAnalytics,
  StudentAnalytics,
} from '@/domain';

import type {
  AnalyticsMistakesDto,
  AnalyticsScoresDto,
  GroupAnalyticsResponseDto,
  OverviewAnalyticsResponseDto,
  StudentAnalyticsResponseDto,
} from '../dto/analytics.dto';

export function toOverviewAnalytics(dto: OverviewAnalyticsResponseDto): OverviewAnalytics {
  return {
    groupCount: dto.groupCount,
    studentCount: dto.studentCount,
    essayCount: dto.essayCount,
    essaysWithStudent: dto.essaysWithStudent,
    essaysLast30Days: dto.essaysLast30Days,
    hasEnoughData: dto.hasEnoughData,
    scores: toScores(dto.scores),
    weakestDirection: dto.weakestDirection,
    mistakes: toMistakes(dto.mistakes),
    weaknesses: dto.weaknesses ?? [],
    recommendations: dto.recommendations ?? [],
    groups: dto.groups ?? [],
  };
}

export function toGroupAnalytics(dto: GroupAnalyticsResponseDto): GroupAnalytics {
  return {
    groupId: dto.groupId,
    name: dto.name,
    studentCount: dto.studentCount,
    essayCount: dto.essayCount,
    hasEnoughData: dto.hasEnoughData,
    scores: toScores(dto.scores),
    weakestDirection: dto.weakestDirection,
    mistakes: toMistakes(dto.mistakes),
    students: dto.students ?? [],
  };
}

export function toStudentAnalytics(dto: StudentAnalyticsResponseDto): StudentAnalytics {
  return {
    studentId: dto.studentId,
    fullName: dto.fullName,
    groupId: dto.groupId,
    groupName: dto.groupName,
    grade: dto.grade,
    essayCount: dto.essayCount,
    hasEnoughData: dto.hasEnoughData,
    scores: toScores(dto.scores),
    weakestDirection: dto.weakestDirection,
    latestTotal: dto.latestTotal,
    previousTotal: dto.previousTotal,
    delta: dto.delta,
    mistakes: toMistakes(dto.mistakes),
    trend: dto.trend ?? [],
    weaknesses: dto.weaknesses ?? [],
    recommendations: dto.recommendations ?? [],
  };
}

function toScores(dto: AnalyticsScoresDto | null | undefined): AnalyticsScores {
  return {
    total: dto?.total ?? 0,
    totalPercent: dto?.totalPercent ?? 0,
    directions: dto?.directions ?? [],
  };
}

function toMistakes(dto: AnalyticsMistakesDto | null | undefined): AnalyticsMistakes {
  return {
    total: dto?.total ?? 0,
    averagePerEssay: dto?.averagePerEssay ?? 0,
    perHundredWords: dto?.perHundredWords ?? 0,
    categories: dto?.categories ?? [],
  };
}
