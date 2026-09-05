import type { AuthTokens } from '../models/user';

/**
 * Token saxlama strategiyası.
 * Veb üçün: access token yaddaşda, refresh token localStorage-da (§6.1).
 */
export interface TokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  save(tokens: AuthTokens): void;
  clear(): void;
}
