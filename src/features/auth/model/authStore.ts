import { createStore, type StoreApi } from 'zustand/vanilla';

import type {
  AuthRepository,
  LoginCommand,
  RegisterCommand,
  TokenStorage,
  UserIdentity,
} from '@/domain';

export type AuthStatus = 'bootstrapping' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  readonly status: AuthStatus;
  readonly user: UserIdentity | null;
  /** Sessiyanın vaxtı bitdiyi üçün çıxış edildisə `true` (login səhifəsində mesaj göstərilir). */
  readonly expired: boolean;
  bootstrap: () => Promise<void>;
  login: (command: LoginCommand) => Promise<void>;
  register: (command: RegisterCommand) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserIdentity) => void;
  handleSessionExpired: () => void;
  acknowledgeExpiry: () => void;
}

export type AuthStore = StoreApi<AuthState>;

export interface AuthStoreDependencies {
  readonly auth: AuthRepository;
  readonly tokenStorage: TokenStorage;
}

/**
 * Auth vəziyyəti yeganə "server state olmayan" sessiya vəziyyətidir.
 * Asılılıqlar konstruktorda verilir — store konkret HTTP implementasiyasını tanımır.
 */
export function createAuthStore({ auth, tokenStorage }: AuthStoreDependencies): AuthStore {
  return createStore<AuthState>((set, get) => ({
    status: 'bootstrapping',
    user: null,
    expired: false,

    /** Səhifə açılanda: refresh token varsa sessiya bərpa edilir. */
    async bootstrap() {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        set({ status: 'unauthenticated', user: null });
        return;
      }
      try {
        const session = await auth.refresh(refreshToken);
        tokenStorage.save(session);
        set({ status: 'authenticated', user: session.user, expired: false });
      } catch {
        tokenStorage.clear();
        set({ status: 'unauthenticated', user: null });
      }
    },

    async login(command) {
      const session = await auth.login(command);
      tokenStorage.save(session);
      set({ status: 'authenticated', user: session.user, expired: false });
    },

    async register(command) {
      await auth.register(command);
    },

    async logout() {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        try {
          await auth.logout(refreshToken);
        } catch {
          // Serverə çatmasa da lokal sessiya bağlanmalıdır (best-effort).
        }
      }
      tokenStorage.clear();
      set({ status: 'unauthenticated', user: null, expired: false });
    },

    setUser(user) {
      set({ user });
    },

    /** HTTP qatı refresh edə bilməyəndə çağırır. */
    handleSessionExpired() {
      if (get().status === 'unauthenticated') return;
      tokenStorage.clear();
      set({ status: 'unauthenticated', user: null, expired: true });
    },

    acknowledgeExpiry() {
      set({ expired: false });
    },
  }));
}
