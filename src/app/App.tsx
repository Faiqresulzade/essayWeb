import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { FullScreenLoader } from '@/shared/ui/states';

import { AppProviders } from './providers/AppProviders';
import { AppRoutes } from './router/AppRoutes';
import { AuthBootstrap } from './router/guards';

export function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AuthBootstrap>
          <Suspense fallback={<FullScreenLoader />}>
            <AppRoutes />
          </Suspense>
        </AuthBootstrap>
      </BrowserRouter>
    </AppProviders>
  );
}
