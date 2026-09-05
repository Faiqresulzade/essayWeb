import { create } from 'zustand';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'essaycheck_theme';
const DARK_CLASS = 'dark';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

/** Tema xarici asılılığı olmayan sırf UI vəziyyətidir — qlobal store kifayətdir. */
export const useThemeStore = create<ThemeState>(set => ({
  mode: readStoredMode(),
  setMode: mode => {
    persistMode(mode);
    applyMode(mode);
    set({ mode });
  },
}));

/** `system` seçilibsə brauzer seçiminə qulaq asır. Təmizləyici funksiya qaytarır. */
export function watchSystemTheme(): () => void {
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => {
    if (useThemeStore.getState().mode === 'system') applyMode('system');
  };
  query.addEventListener('change', handler);
  return () => query.removeEventListener('change', handler);
}

export function applyMode(mode: ThemeMode): void {
  const isDark = mode === 'dark' || (mode === 'system' && prefersDark());
  document.documentElement.classList.toggle(DARK_CLASS, isDark);
}

export function resolvedTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') return prefersDark() ? 'dark' : 'light';
  return mode;
}

function prefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function readStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    // localStorage əlçatan deyilsə sistem rejimi işlədilir.
  }
  return 'system';
}

function persistMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Diqqətə alınmır.
  }
}
