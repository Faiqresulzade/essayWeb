import type {
  CreateLessonCommand,
  Lesson,
  LessonLibraryQuery,
  LessonPage,
  LessonRepository,
  RequestOptions,
} from '@/domain';
import { PAGE_SIZE, TIMEOUT_MS } from '@/shared/config/app';

import type { LessonListResponseDto, LessonResponseDto } from '../dto/lesson.dto';
import { API_ROUTES } from '../http/apiRoutes';
import type { HttpClient } from '../http/HttpClient';
import { toLesson, toLessonPage } from '../mappers/lessonMapper';

export class HttpLessonRepository implements LessonRepository {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async createOrOpen(command: CreateLessonCommand, options: RequestOptions = {}): Promise<Lesson> {
    const dto = await this.http.request<LessonResponseDto>({
      method: 'POST',
      url: API_ROUTES.lessons.root,
      timeoutMs: TIMEOUT_MS.ai,
      body: command,
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return toLesson(dto);
  }

  async getLibrary(query: LessonLibraryQuery, options: RequestOptions = {}): Promise<LessonPage> {
    const dto = await this.http.request<LessonListResponseDto>({
      method: 'GET',
      url: API_ROUTES.lessons.root,
      query: {
        search: query.search,
        grade: query.grade,
        mine: query.mine,
        page: query.page ?? 1,
        pageSize: query.pageSize ?? PAGE_SIZE.lessons,
      },
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return toLessonPage(dto);
  }

  async getById(id: number, options: RequestOptions = {}): Promise<Lesson> {
    const dto = await this.http.request<LessonResponseDto>({
      method: 'GET',
      url: API_ROUTES.lessons.byId(id),
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return toLesson(dto);
  }
}
