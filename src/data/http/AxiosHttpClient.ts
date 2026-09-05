import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

import type { TokenStorage } from '@/domain';
import { TIMEOUT_MS } from '@/shared/config/app';

import { toAppError } from './errorMapper';
import type { HttpClient, HttpRequest, QueryValue } from './HttpClient';
import type { TokenRefresher } from './tokenRefresher';

interface RetriableConfig extends InternalAxiosRequestConfig {
  retriedAfterRefresh?: boolean;
}

export interface AxiosHttpClientOptions {
  readonly baseUrl: string;
  readonly tokenStorage: TokenStorage;
  readonly refreshTokens: TokenRefresher;
  /** Refresh mümkün olmadıqda çağırılır — istifadəçi login səhifəsinə yönləndirilir. */
  readonly onSessionExpired: () => void;
}

/**
 * `HttpClient` interfeysinin axios implementasiyası.
 * Yeganə məsuliyyəti: sorğunu göndərmək, token əlavə etmək, 401-də bir dəfə
 * refresh edib təkrarlamaq və xətanı `AppError`-a çevirmək.
 */
export class AxiosHttpClient implements HttpClient {
  private readonly instance: AxiosInstance;
  private readonly tokenStorage: TokenStorage;
  private readonly refreshTokens: TokenRefresher;
  private readonly onSessionExpired: () => void;
  /** Paralel 401-lərdə refresh yalnız BİR dəfə çağırılır. */
  private refreshInFlight: Promise<string | null> | null = null;

  constructor(options: AxiosHttpClientOptions) {
    this.tokenStorage = options.tokenStorage;
    this.refreshTokens = options.refreshTokens;
    this.onSessionExpired = options.onSessionExpired;
    this.instance = axios.create({
      baseURL: options.baseUrl,
      timeout: TIMEOUT_MS.default,
    });
    this.instance.interceptors.response.use(
      response => response,
      (error: unknown) => this.handleResponseError(error),
    );
  }

  async request<TResponse>(request: HttpRequest): Promise<TResponse> {
    try {
      const response = await this.instance.request<TResponse>(this.toAxiosConfig(request));
      return response.data;
    } catch (error) {
      throw toAppError(error);
    }
  }

  private toAxiosConfig(request: HttpRequest): AxiosRequestConfig {
    const headers: Record<string, string> = {};

    if (request.authenticated !== false) {
      const token = this.tokenStorage.getAccessToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    // multipart üçün Content-Type-ı brauzer boundary ilə birlikdə özü təyin etməlidir.
    if (!request.form) headers['Content-Type'] = 'application/json';

    return {
      method: request.method,
      url: request.url,
      headers,
      ...(request.form ? { data: request.form } : {}),
      ...(request.body !== undefined ? { data: request.body } : {}),
      ...(request.query ? { params: cleanQuery(request.query) } : {}),
      ...(request.signal ? { signal: request.signal } : {}),
      ...(request.timeoutMs ? { timeout: request.timeoutMs } : {}),
    };
  }

  private async handleResponseError(error: unknown): Promise<unknown> {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      throw error;
    }

    const original = error.config as RetriableConfig | undefined;
    const wasAuthenticated = Boolean(original?.headers?.Authorization);

    if (!original || original.retriedAfterRefresh || !wasAuthenticated) {
      throw error;
    }
    original.retriedAfterRefresh = true;

    const newToken = await this.refreshOnce();
    if (!newToken) {
      this.tokenStorage.clear();
      this.onSessionExpired();
      throw error;
    }

    original.headers.Authorization = `Bearer ${newToken}`;
    return this.instance.request(original);
  }

  private refreshOnce(): Promise<string | null> {
    this.refreshInFlight ??= this.performRefresh().finally(() => {
      this.refreshInFlight = null;
    });
    return this.refreshInFlight;
  }

  private async performRefresh(): Promise<string | null> {
    const refreshToken = this.tokenStorage.getRefreshToken();
    if (!refreshToken) return null;

    const tokens = await this.refreshTokens(refreshToken);
    if (!tokens) return null;

    // Rotasiya: hər refresh yeni cüt qaytarır, hər ikisi yenidən saxlanılır.
    this.tokenStorage.save(tokens);
    return tokens.accessToken;
  }
}

function cleanQuery(query: Readonly<Record<string, QueryValue>>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    result[key] = String(value);
  }
  return result;
}
