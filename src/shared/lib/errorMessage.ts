import { isAppError, type AppErrorCode } from '@/domain';

import { strings } from '../i18n/strings';

/** Xəta koduna görə ümumi (kontekstdən asılı olmayan) mesajlar. */
const GENERIC_MESSAGES: Readonly<Record<AppErrorCode, string>> = {
  network: strings.common.networkError,
  timeout: strings.common.timeout,
  canceled: strings.common.unknownError,
  unauthorized: strings.common.sessionExpired,
  'account-locked': strings.auth.invalidCredentials,
  forbidden: strings.common.forbidden,
  'not-found': strings.common.notFound,
  validation: strings.common.unknownError,
  unprocessable: strings.common.unknownError,
  'limit-reached': strings.essay.limitReachedMessage,
  'ai-unavailable': strings.essay.aiUnavailable,
  server: strings.common.serverError,
  unknown: strings.common.unknownError,
};

/**
 * Xətanı istifadəçi mesajına çevirir.
 * Ardıcıllıq: kontekstə xas mesaj → backend mesajı → koda görə ümumi mesaj.
 */
export function describeError(
  error: unknown,
  overrides: Partial<Record<AppErrorCode, string>> = {},
): string {
  if (!isAppError(error)) return strings.common.unknownError;

  const override = overrides[error.code];
  if (override) return override;

  // Şəbəkə xətalarında backend mesajı yoxdur; digər hallarda backend mesajı daha dəqiqdir.
  return error.describe(GENERIC_MESSAGES[error.code]);
}

/** Forma sahələrinə bağlanan xətalar (ASP.NET ProblemDetails). */
export function fieldErrorsOf(error: unknown): Record<string, string> {
  if (!isAppError(error) || !error.fieldErrors) return {};
  const result: Record<string, string> = {};
  for (const [field, messages] of Object.entries(error.fieldErrors)) {
    const [first] = messages;
    if (first) result[toCamelCase(field)] = first;
  }
  return result;
}

function toCamelCase(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1);
}
