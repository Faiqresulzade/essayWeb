import { createContext, use } from 'react';

import type { PaymentProvider, Repositories, TokenStorage } from '@/domain';

export interface Services {
  readonly repositories: Repositories;
  readonly tokenStorage: TokenStorage;
  readonly paymentProvider: PaymentProvider;
}

export const ServicesContext = createContext<Services | null>(null);

/**
 * Asılılıqların injeksiyası: implementasiyalar yuxarıdan verilir, aşağıda yalnız
 * interfeys tanınır (DIP). Testdə saxta implementasiya vermək kifayətdir.
 */
export function useServices(): Services {
  const services = use(ServicesContext);
  if (!services) {
    throw new Error('useServices yalnız <ServicesProvider> daxilində işlədilə bilər.');
  }
  return services;
}

export function useRepositories(): Repositories {
  return useServices().repositories;
}
