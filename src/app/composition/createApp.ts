import { createDataLayer } from '@/data/container';
import { createAuthStore, type AuthStore } from '@/features/auth/model/authStore';
import type { Services } from '@/shared/di';

export interface AppComposition {
  readonly services: Services;
  readonly authStore: AuthStore;
}

/**
 * Tətbiqin kompozisiya kökü: data qatı və auth store burada bir-birinə bağlanır.
 * Başqa heç bir yerdə konkret implementasiya yaradılmır.
 */
export function createApp(): AppComposition {
  // HTTP qatı sessiya bitəndə auth store-a xəbər verməlidir, amma store hələ yaradılmayıb —
  // ona görə bildiriş bir dolayı funksiya üzərindən ötürülür.
  let notifySessionExpired = () => {};

  const dataLayer = createDataLayer({
    onSessionExpired: () => notifySessionExpired(),
  });

  const authStore = createAuthStore({
    auth: dataLayer.repositories.auth,
    tokenStorage: dataLayer.tokenStorage,
  });

  notifySessionExpired = () => authStore.getState().handleSessionExpired();

  return {
    services: {
      repositories: dataLayer.repositories,
      tokenStorage: dataLayer.tokenStorage,
      paymentProvider: dataLayer.paymentProvider,
    },
    authStore,
  };
}
