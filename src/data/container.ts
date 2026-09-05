import type { PaymentProvider, Repositories, TokenStorage } from '@/domain';
import { env } from '@/shared/config/env';

import { AxiosHttpClient } from './http/AxiosHttpClient';
import { createTokenRefresher } from './http/tokenRefresher';
import { comingSoonPaymentProvider } from './payment/comingSoonPaymentProvider';
import { HttpAccountRepository } from './repositories/HttpAccountRepository';
import { HttpAnalyticsRepository } from './repositories/HttpAnalyticsRepository';
import { HttpAuthRepository } from './repositories/HttpAuthRepository';
import { HttpEssayRepository } from './repositories/HttpEssayRepository';
import { HttpGroupRepository } from './repositories/HttpGroupRepository';
import { HttpLessonRepository } from './repositories/HttpLessonRepository';
import { HttpStudentRepository } from './repositories/HttpStudentRepository';
import { HttpSubscriptionRepository } from './repositories/HttpSubscriptionRepository';
import { BrowserTokenStorage } from './storage/BrowserTokenStorage';

export interface DataLayer {
  readonly repositories: Repositories;
  readonly tokenStorage: TokenStorage;
  readonly paymentProvider: PaymentProvider;
}

export interface DataLayerOptions {
  /** Refresh mümkün olmadıqda çağırılır (sessiya bitib). */
  readonly onSessionExpired: () => void;
  readonly baseUrl?: string;
}

/**
 * Kompozisiya kökü: bütün konkret implementasiyalar yalnız burada bir-birinə bağlanır.
 * Yuxarı qatlar (features/pages) yalnız `Repositories` interfeysini görür.
 */
export function createDataLayer(options: DataLayerOptions): DataLayer {
  const baseUrl = options.baseUrl ?? env.apiBaseUrl;
  const tokenStorage = new BrowserTokenStorage();

  const http = new AxiosHttpClient({
    baseUrl,
    tokenStorage,
    refreshTokens: createTokenRefresher(baseUrl),
    onSessionExpired: options.onSessionExpired,
  });

  return {
    tokenStorage,
    paymentProvider: comingSoonPaymentProvider,
    repositories: {
      auth: new HttpAuthRepository(http),
      account: new HttpAccountRepository(http),
      essay: new HttpEssayRepository(http),
      lesson: new HttpLessonRepository(http),
      group: new HttpGroupRepository(http),
      student: new HttpStudentRepository(http),
      analytics: new HttpAnalyticsRepository(http),
      subscription: new HttpSubscriptionRepository(http),
    },
  };
}
