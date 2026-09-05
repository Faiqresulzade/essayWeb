/**
 * Bütün qatlarda işlədilən vahid xəta tipi.
 * HTTP statusları burada semantik koda çevrilir — UI status kodu ilə işləmir,
 * yalnız `code` ilə mesaj seçir.
 */
export type AppErrorCode =
  | 'network'
  | 'timeout'
  | 'canceled'
  | 'unauthorized'
  | 'account-locked'
  | 'forbidden'
  | 'not-found'
  | 'validation'
  /** 422 — mətn esse deyil / dərs mövzusu ingilis dilinə aid deyil. */
  | 'unprocessable'
  /** 429 — gündəlik limit bitib. */
  | 'limit-reached'
  /** 502 / 503 — AI xidməti müvəqqəti əlçatan deyil. */
  | 'ai-unavailable'
  | 'server'
  | 'unknown';

export type FieldErrors = Readonly<Record<string, readonly string[]>>;

interface AppErrorOptions {
  readonly status?: number;
  /** Backend-dən gələn izahlı mesaj (Azərbaycan dilində). */
  readonly serverMessage?: string;
  readonly fieldErrors?: FieldErrors;
  /** `account-locked` halında blokun bitmə vaxtı (ISO, UTC). */
  readonly lockoutEndsAt?: string;
  readonly cause?: unknown;
}

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number | undefined;
  readonly serverMessage: string | undefined;
  readonly fieldErrors: FieldErrors | undefined;
  readonly lockoutEndsAt: string | undefined;

  constructor(code: AppErrorCode, options: AppErrorOptions = {}) {
    super(options.serverMessage ?? code, { cause: options.cause });
    this.name = 'AppError';
    this.code = code;
    this.status = options.status;
    this.serverMessage = options.serverMessage;
    this.fieldErrors = options.fieldErrors;
    this.lockoutEndsAt = options.lockoutEndsAt;
  }

  /** Backend mesajı varsa onu, yoxsa verilmiş ehtiyat mətni qaytarır. */
  describe(fallback: string): string {
    return this.serverMessage?.trim() || firstFieldError(this.fieldErrors) || fallback;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function appErrorCode(error: unknown): AppErrorCode {
  return isAppError(error) ? error.code : 'unknown';
}

function firstFieldError(fieldErrors: FieldErrors | undefined): string | undefined {
  if (!fieldErrors) return undefined;
  for (const messages of Object.values(fieldErrors)) {
    const [first] = messages;
    if (first) return first;
  }
  return undefined;
}
