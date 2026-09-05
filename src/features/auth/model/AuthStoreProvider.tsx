import type { ReactNode } from 'react';

import { AuthStoreContext } from './authContext';
import type { AuthStore } from './authStore';

interface AuthStoreProviderProps {
  readonly store: AuthStore;
  readonly children: ReactNode;
}

export function AuthStoreProvider({ store, children }: AuthStoreProviderProps) {
  return <AuthStoreContext value={store}>{children}</AuthStoreContext>;
}
