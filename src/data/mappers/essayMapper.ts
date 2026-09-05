import {
  DIRECTION_MAX_SCORE,
  type Essay,
  type EssayHistoryPage,
  type EssayMistakeCounts,
  type EssayScores,
  type EssaySummary,
} from '@/domain';

import type {
  EssayDetailResponseDto,
  EssayHistoryItemDto,
  EssayHistoryResponseDto,
  EssayScoresDto,
  EssayStatisticsDto,
} from '../dto/essay.dto';

export function toEssay(dto: EssayDetailResponseDto): Essay {
  return {
    ...toEssaySummary(dto),
    source: dto.source,
    accuracyPercent: dto.accuracyPercent,
    correctedEssay: dto.correctedEssay,
    statistics: toMistakeCounts(dto.statistics),
    mistakes: dto.mistakes ?? [],
    scores: toScores(dto.scores),
    feedback: {
      strengths: dto.feedback?.strengths ?? [],
      weaknesses: dto.feedback?.weaknesses ?? [],
      recommendations: dto.feedback?.recommendations ?? [],
    },
  };
}

export function toEssaySummary(dto: EssayHistoryItemDto | EssayDetailResponseDto): EssaySummary {
  return {
    id: dto.id,
    title: dto.title,
    createdAt: dto.createdAt,
    wordCount: dto.wordCount,
    totalScore: dto.totalScore,
    grade: dto.grade,
    studentId: dto.studentId,
    studentName: dto.studentName,
  };
}

export function toEssayHistoryPage(dto: EssayHistoryResponseDto): EssayHistoryPage {
  return {
    items: (dto.items ?? []).map(toEssaySummary),
    totalCount: dto.totalCount,
    averageScore: dto.averageScore,
    page: dto.page,
    pageSize: dto.pageSize,
    totalPages: dto.totalPages,
  };
}

/**
 * DİM meyarları düz siyahıya çevrilir — UI 4 istiqaməti eyni komponentlə
 * dövr edərək göstərə bilsin (təkrarlanan `scores.structure`, `scores.content`... yoxdur).
 */
function toScores(dto: EssayScoresDto): EssayScores {
  return {
    total: dto.total,
    directions: [
      {
        direction: 'Structure',
        score: dto.structure,
        max: DIRECTION_MAX_SCORE.Structure,
        comment: dto.structureComment,
      },
      {
        direction: 'Content',
        score: dto.content,
        max: DIRECTION_MAX_SCORE.Content,
        comment: dto.contentComment,
      },
      {
        direction: 'Grammar',
        score: dto.grammar,
        max: DIRECTION_MAX_SCORE.Grammar,
        comment: dto.grammarComment,
      },
      {
        direction: 'Vocabulary',
        score: dto.vocabulary,
        max: DIRECTION_MAX_SCORE.Vocabulary,
        comment: dto.vocabularyComment,
      },
    ],
  };
}

function toMistakeCounts(dto: EssayStatisticsDto): EssayMistakeCounts {
  return {
    Grammar: dto.grammar,
    Spelling: dto.spelling,
    Vocabulary: dto.vocabulary,
    NaturalExpression: dto.naturalExpression,
    total: dto.total,
  };
}
