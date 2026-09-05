import { QueryClient } from '@tanstack/react-query';

import { appErrorCode, type AppErrorCode } from '@/domain';

const MAX_RETRIES = 2;

/** Təkrar cəhdin mənasız olduğu hallar — istifadəçi və ya plan səbəbli xətalar. */
const NON_RETRYABLE: readonly AppErrorCode[] = [
  'unauthorized',
  'forbidden',
  'not-found',
  'validation',
  'unprocessable',
  'limit-reached',
  'account-locked',
  'canceled',
];

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Analitika və siyahılar üçün münasib: hər fokusda deyil, ekran açılışında yüklənir.
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (NON_RETRYABLE.includes(appErrorCode(error))) return false;
          return failureCount < MAX_RETRIES;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}
