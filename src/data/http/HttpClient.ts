export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type QueryValue = string | number | boolean | undefined | null;

export interface HttpRequest {
  readonly method: HttpMethod;
  readonly url: string;
  /** JSON gövdəsi. `form` ilə birlikdə istifadə edilmir. */
  readonly body?: unknown;
  /** multipart/form-data gövdəsi — Content-Type brauzer tərəfindən təyin olunur. */
  readonly form?: FormData;
  readonly query?: Readonly<Record<string, QueryValue>>;
  readonly signal?: AbortSignal;
  readonly timeoutMs?: number;
  /** Defolt `true`; yalnız açıq (anonim) endpoint-lər üçün `false`. */
  readonly authenticated?: boolean;
}

/**
 * HTTP nəqliyyat qatının abstraksiyası.
 * Repository-lər yalnız bu interfeysi tanıyır — axios detalları gizlidir (DIP).
 */
export interface HttpClient {
  request<TResponse>(request: HttpRequest): Promise<TResponse>;
}
