import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';

import { AuthStoreProvider } from '@/features/auth/model/AuthStoreProvider';
import { ServicesProvider } from '@/shared/di';
import {
  applyMode,
  resolvedTheme,
  useThemeStore,
  watchSystemTheme,
} from '@/shared/theme/themeStore';
import { Toaster } from '@/shared/ui/primitives/sonner';

import { createApp } from '../composition/createApp';
import { createQueryClient } from './queryClient';

interface AppProvidersProps {
  readonly children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  // Kompozisiya bir dəfə qurulur və tətbiqin ömrü boyu dəyişmir.
  const [{ services, authStore }] = useState(createApp);
  const [queryClient] = useState(createQueryClient);
  const themeMode = useThemeStore(state => state.mode);

  useEffect(() => {
    applyMode(themeMode);
  }, [themeMode]);

  useEffect(() => watchSystemTheme(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ServicesProvider services={services}>
        <AuthStoreProvider store={authStore}>
          {children}
          <Toaster theme={resolvedTheme(themeMode)} />
        </AuthStoreProvider>
      </ServicesProvider>
    </QueryClientProvider>
  );
}
