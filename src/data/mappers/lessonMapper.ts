import type { Lesson, LessonPage, LessonSlide, LessonSummary } from '@/domain';

import type {
  LessonListItemDto,
  LessonListResponseDto,
  LessonResponseDto,
  LessonSlideDto,
} from '../dto/lesson.dto';

export function toLesson(dto: LessonResponseDto): Lesson {
  return {
    id: dto.id,
    topic: dto.topic,
    grade: dto.grade,
    createdByName: dto.createdByName,
    isMine: dto.isMine,
    createdAt: dto.createdAt,
    // Slaydların sırası backend-dən gəldiyi kimi saxlanılır (yenidən sıralanmır).
    slides: (dto.slides ?? []).map(toSlide),
    // Test variantları YENİDƏN QARIŞDIRILMIR — ortaq kitabxanada sıra hamı üçün eyni qalmalıdır.
    quiz: (dto.quiz ?? []).filter(isValidQuizQuestion),
  };
}

export function toLessonSummary(dto: LessonListItemDto): LessonSummary {
  return {
    id: dto.id,
    topic: dto.topic,
    grade: dto.grade,
    createdByName: dto.createdByName,
    isMine: dto.isMine,
    slideCount: dto.slideCount,
    createdAt: dto.createdAt,
  };
}

export function toLessonPage(dto: LessonListResponseDto): LessonPage {
  return {
    items: (dto.items ?? []).map(toLessonSummary),
    totalCount: dto.totalCount,
    page: dto.page,
    pageSize: dto.pageSize,
    totalPages: dto.totalPages,
  };
}

function toSlide(dto: LessonSlideDto): LessonSlide {
  return {
    type: dto.type,
    title: dto.title,
    body: dto.body,
    formula: dto.formula,
    keywords: dto.keywords ?? [],
    examples: dto.examples ?? [],
    mistakes: dto.mistakes ?? [],
    comparison: dto.comparison,
    points: dto.points ?? [],
  };
}

function isValidQuizQuestion(dto: { options: string[]; correctIndex: number }): boolean {
  return dto.options.length > 0 && dto.correctIndex >= 0 && dto.correctIndex < dto.options.length;
}
