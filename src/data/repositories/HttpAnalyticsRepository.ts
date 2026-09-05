import type {
  AnalyticsRepository,
  GroupAnalytics,
  OverviewAnalytics,
  RequestOptions,
  StudentAnalytics,
} from '@/domain';

import type {
  GroupAnalyticsResponseDto,
  OverviewAnalyticsResponseDto,
  StudentAnalyticsResponseDto,
} from '../dto/analytics.dto';
import { API_ROUTES } from '../http/apiRoutes';
import type { HttpClient } from '../http/HttpClient';
import {
  toGroupAnalytics,
  toOverviewAnalytics,
  toStudentAnalytics,
} from '../mappers/analyticsMapper';

export class HttpAnalyticsRepository implements AnalyticsRepository {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async getOverview(options: RequestOptions = {}): Promise<OverviewAnalytics> {
    const dto = await this.http.request<OverviewAnalyticsResponseDto>({
      method: 'GET',
      url: API_ROUTES.analytics.overview,
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return toOverviewAnalytics(dto);
  }

  async getGroup(groupId: number, options: RequestOptions = {}): Promise<GroupAnalytics> {
    const dto = await this.http.request<GroupAnalyticsResponseDto>({
      method: 'GET',
      url: API_ROUTES.analytics.group(groupId),
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return toGroupAnalytics(dto);
  }

  async getStudent(studentId: number, options: RequestOptions = {}): Promise<StudentAnalytics> {
    const dto = await this.http.request<StudentAnalyticsResponseDto>({
      method: 'GET',
      url: API_ROUTES.analytics.student(studentId),
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return toStudentAnalytics(dto);
  }
}
