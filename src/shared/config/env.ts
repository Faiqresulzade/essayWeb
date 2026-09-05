/** Mühit dəyişənləri tək nöqtədə oxunur və başlanğıcda yoxlanılır (fail fast). */

const DEFAULT_API_BASE_URL = 'https://essaycheck-api.onrender.com';

function readApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim();
  const value = raw && raw.length > 0 ? raw : DEFAULT_API_BASE_URL;
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export const env = {
  apiBaseUrl: readApiBaseUrl(),
  isProduction: import.meta.env.PROD,
} as const;
