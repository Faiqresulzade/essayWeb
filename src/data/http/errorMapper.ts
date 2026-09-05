import axios from 'axios';

import { AppError, type AppErrorCode, type FieldErrors } from '@/domain';

/** Backend-in qaytardığı bütün xəta gövdələrinin birləşmiş forması. */
interface ApiErrorBody {
  message?: string;
  title?: string;
  detail?: string;
  errors?: Record<string, string[]> | string[];
  succeeded?: boolean;
  lockoutEndsAt?: string;
}

const STATUS_CODES: Readonly<Record<number, AppErrorCode>> = {
  400: 'validation',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not-found',
  422: 'unprocessable',
  423: 'account-locked',
  429: 'limit-reached',
  502: 'ai-unavailable',
  503: 'ai-unavailable',
  504: 'ai-unavailable',
};

/** Axios xətasını qatlar arası vahid `AppError`-a çevirir. */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (axios.isCancel(error)) {
    return new AppError('canceled', { cause: error });
  }

  if (!axios.isAxiosError(error)) {
    return new AppError('unknown', { cause: error });
  }

  if (!error.response) {
    const code: AppErrorCode = error.code === 'ECONNABORTED' ? 'timeout' : 'network';
    return new AppError(code, { cause: error });
  }

  const { status, data } = error.response;
  const body = isObject(data) ? (data as ApiErrorBody) : undefined;

  return new AppError(codeForStatus(status), {
    status,
    ...(serverMessageOf(body) !== undefined ? { serverMessage: serverMessageOf(body) } : {}),
    ...(fieldErrorsOf(body) !== undefined ? { fieldErrors: fieldErrorsOf(body) } : {}),
    ...(body?.lockoutEndsAt ? { lockoutEndsAt: body.lockoutEndsAt } : {}),
    cause: error,
  });
}

function codeForStatus(status: number): AppErrorCode {
  const mapped = STATUS_CODES[status];
  if (mapped) return mapped;
  return status >= 500 ? 'server' : 'unknown';
}

function serverMessageOf(body: ApiErrorBody | undefined): string | undefined {
  if (!body) return undefined;
  if (typeof body.message === 'string' && body.message.trim()) return body.message.trim();

  // AuthResult forması: { succeeded: false, message: "", errors: ["..."] }
  if (Array.isArray(body.errors)) {
    const first = body.errors.find(item => typeof item === 'string' && item.trim());
    if (first) return first;
  }

  if (typeof body.detail === 'string' && body.detail.trim()) return body.detail.trim();
  return undefined;
}

function fieldErrorsOf(body: ApiErrorBody | undefined): FieldErrors | undefined {
  if (!body?.errors || Array.isArray(body.errors)) return undefined;
  const entries = Object.entries(body.errors).filter(([, messages]) => Array.isArray(messages));
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
