import type {
  DailyUsage,
  PlanInfo,
  RequestOptions,
  Subscription,
  SubscriptionRepository,
} from '@/domain';

import type {
  DailyUsageStatusResponseDto,
  PlanInfoResponseDto,
  SubscriptionResponseDto,
} from '../dto/subscription.dto';
import { API_ROUTES } from '../http/apiRoutes';
import type { HttpClient } from '../http/HttpClient';
import { toDailyUsage, toPlanInfo, toSubscription } from '../mappers/subscriptionMapper';

export class HttpSubscriptionRepository implements SubscriptionRepository {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async getPlans(options: RequestOptions = {}): Promise<PlanInfo[]> {
    const dto = await this.http.request<PlanInfoResponseDto[]>({
      method: 'GET',
      url: API_ROUTES.subscription.plans,
      // Plan kataloqu açıq endpoint-dir — tanıtım səhifəsində token olmadan da lazımdır.
      authenticated: false,
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return (dto ?? []).map(toPlanInfo);
  }

  async getCurrent(options: RequestOptions = {}): Promise<Subscription> {
    const dto = await this.http.request<SubscriptionResponseDto>({
      method: 'GET',
      url: API_ROUTES.subscription.current,
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return toSubscription(dto);
  }

  async getUsage(options: RequestOptions = {}): Promise<DailyUsage> {
    const dto = await this.http.request<DailyUsageStatusResponseDto>({
      method: 'GET',
      url: API_ROUTES.subscription.usage,
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return toDailyUsage(dto);
  }

  /** Cavab yenilənmiş abunəliyi qaytarır — ikinci GET sorğusuna ehtiyac yoxdur. */
  async cancel(): Promise<Subscription> {
    const dto = await this.http.request<SubscriptionResponseDto>({
      method: 'POST',
      url: API_ROUTES.subscription.cancel,
    });
    return toSubscription(dto);
  }
}
