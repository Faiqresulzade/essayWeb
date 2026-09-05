import type { AuthTokens, TokenStorage } from '@/domain';

const REFRESH_TOKEN_KEY = 'essaycheck_refresh_token';

/**
 * Access token YALNIZ yaddaşda saxlanılır (XSS zamanı oğurlanmasın, səhifə yenilənəndə itsin),
 * refresh token isə `localStorage`-da — səhifə yenilənəndə sessiya bərpa olunsun.
 */
export class BrowserTokenStorage implements TokenStorage {
  private accessToken: string | null = null;

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      // Şəxsi rejimdə localStorage bloklana bilər — sessiya yalnız cari tabda yaşayır.
      return null;
    }
  }

  save(tokens: AuthTokens): void {
    this.accessToken = tokens.accessToken;
    try {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    } catch {
      // Yazıla bilmirsə də cari sessiya işləməyə davam edir.
    }
  }

  clear(): void {
    this.accessToken = null;
    try {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // Diqqətə alınmır.
    }
  }
}
