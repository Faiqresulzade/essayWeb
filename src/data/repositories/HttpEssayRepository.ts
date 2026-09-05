import {
  type Essay,
  type EssayHistoryPage,
  type EssayHistoryQuery,
  type EssayRepository,
  type EvaluateGrade9EssayCommand,
  type EvaluateTextEssayCommand,
  type RequestOptions,
} from '@/domain';
import { PAGE_SIZE, TIMEOUT_MS } from '@/shared/config/app';

import type {
  DeleteAllHistoryResponseDto,
  EssayDetailResponseDto,
  EssayHistoryResponseDto,
  OcrResponseDto,
} from '../dto/essay.dto';
import { API_ROUTES } from '../http/apiRoutes';
import type { HttpClient } from '../http/HttpClient';
import { toEssay, toEssayHistoryPage } from '../mappers/essayMapper';

export class HttpEssayRepository implements EssayRepository {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async evaluateText(
    command: EvaluateTextEssayCommand,
    options: RequestOptions = {},
  ): Promise<Essay> {
    const dto = await this.http.request<EssayDetailResponseDto>({
      method: 'POST',
      url: API_ROUTES.essay.evaluate,
      timeoutMs: TIMEOUT_MS.ai,
      body: {
        text: command.text,
        title: command.title ?? null,
        source: command.source,
        grade: command.grade ?? null,
        topic: command.topic ?? null,
        studentId: command.studentId ?? null,
      },
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return toEssay(dto);
  }

  async evaluateGrade9(
    command: EvaluateGrade9EssayCommand,
    options: RequestOptions = {},
  ): Promise<Essay> {
    const form = new FormData();
    form.append('text', command.text);
    if (command.title) form.append('title', command.title);
    if (command.studentId !== undefined) form.append('studentId', String(command.studentId));
    if (command.promptImage) form.append('promptImage1', command.promptImage);

    const dto = await this.http.request<EssayDetailResponseDto>({
      method: 'POST',
      url: API_ROUTES.essay.evaluateGrade9,
      timeoutMs: TIMEOUT_MS.ai,
      form,
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return toEssay(dto);
  }

  async recognizeText(image: File, options: RequestOptions = {}): Promise<string> {
    const form = new FormData();
    form.append('image', image);

    const dto = await this.http.request<OcrResponseDto>({
      method: 'POST',
      url: API_ROUTES.essay.ocr,
      timeoutMs: TIMEOUT_MS.upload,
      form,
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return dto.text ?? '';
  }

  async getHistory(
    query: EssayHistoryQuery,
    options: RequestOptions = {},
  ): Promise<EssayHistoryPage> {
    const dto = await this.http.request<EssayHistoryResponseDto>({
      method: 'GET',
      url: API_ROUTES.essay.history,
      query: {
        search: query.search,
        studentId: query.studentId,
        groupId: query.groupId,
        page: query.page ?? 1,
        pageSize: query.pageSize ?? PAGE_SIZE.history,
      },
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return toEssayHistoryPage(dto);
  }

  async getById(id: number, options: RequestOptions = {}): Promise<Essay> {
    const dto = await this.http.request<EssayDetailResponseDto>({
      method: 'GET',
      url: API_ROUTES.essay.historyItem(id),
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return toEssay(dto);
  }

  async remove(id: number): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      url: API_ROUTES.essay.historyItem(id),
    });
  }

  async clearHistory(): Promise<number> {
    const dto = await this.http.request<DeleteAllHistoryResponseDto>({
      method: 'DELETE',
      url: API_ROUTES.essay.history,
    });
    return dto?.deleted ?? 0;
  }
}
