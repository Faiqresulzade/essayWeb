import { createContext, use } from 'react';
import { useStore } from 'zustand';

import type { AuthState, AuthStore } from './authStore';

export const AuthStoreContext = createContext<AuthStore | null>(null);

export function useAuthStore<TSelected>(selector: (state: AuthState) => TSelected): TSelected {
  const store = use(AuthStoreContext);
  if (!store) {
    throw new Error('useAuthStore yalnız <AuthStoreProvider> daxilində işlədilə bilər.');
  }
  return useStore(store, selector);
}

export function useAuthActions(): Pick<
  AuthState,
  'login' | 'logout' | 'register' | 'setUser' | 'bootstrap' | 'acknowledgeExpiry'
> {
  const store = use(AuthStoreContext);
  if (!store) {
    throw new Error('useAuthActions yalnız <AuthStoreProvider> daxilində işlədilə bilər.');
  }
  const state = store.getState();
  return {
    login: state.login,
    logout: state.logout,
    register: state.register,
    setUser: state.setUser,
    bootstrap: state.bootstrap,
    acknowledgeExpiry: state.acknowledgeExpiry,
  };
}
