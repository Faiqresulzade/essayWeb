import axios from 'axios';

import type { AuthTokens } from '@/domain';
import { TIMEOUT_MS } from '@/shared/config/app';

import { API_ROUTES } from './apiRoutes';
import type { LoginResponseDto } from '../dto/auth.dto';

export type TokenRefresher = (refreshToken: string) => Promise<AuthTokens | null>;

/**
 * Refresh üçün AYRI axios instansı işlədilir — əks halda refresh sorğusunun özü
 * 401 alanda interceptor sonsuz dövrə düşür.
 */
export function createTokenRefresher(baseUrl: string): TokenRefresher {
  const client = axios.create({ baseURL: baseUrl, timeout: TIMEOUT_MS.refresh });

  return async refreshToken => {
    try {
      const { data } = await client.post<LoginResponseDto>(API_ROUTES.auth.refresh, {
        refreshToken,
      });
      return { accessToken: data.token, refreshToken: data.refreshToken };
    } catch {
      // Refresh token etibarsızdır və ya vaxtı bitib — sessiya bərpa edilə bilmir.
      return null;
    }
  };
}
