import { env } from './env';

export const APP_VERSION = '1.0.0';

export const CONTACT = {
  whatsAppUrl: 'https://wa.me/994997883242',
  email: 'faigrasulzada@gmail.com',
} as const;

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.essaycheckai.app';

/** Backend-in server-render etdiyi hüquqi səhifələr (mobil listinq üçün lazımdır). */
export const BACKEND_LEGAL_URLS = {
  privacy: `${env.apiBaseUrl}/legal/privacy-policy`,
  terms: `${env.apiBaseUrl}/legal/terms-of-service`,
} as const;

/** Siyahı səhifələmə ölçüləri. */
export const PAGE_SIZE = {
  history: 20,
  lessons: 20,
  studentEssays: 10,
} as const;

/** Şəbəkə vaxt aşımları (ms). AI çağırışları uzun çəkir: esse 20-40s, dərs 15-20s. */
export const TIMEOUT_MS = {
  default: 30_000,
  ai: 90_000,
  upload: 60_000,
  refresh: 20_000,
} as const;

/** Axtarış sahələrində gecikmə (ms). */
export const SEARCH_DEBOUNCE_MS = 400;

/** Mərhələli yükləmə mətnlərinin dəyişmə intervalı (ms). */
export const LOADING_STAGE_INTERVAL_MS = {
  essay: 1_700,
  lesson: 2_600,
} as const;
