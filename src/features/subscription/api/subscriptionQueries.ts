import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { DailyUsage, PlanInfo, Subscription } from '@/domain';
import { useRepositories } from '@/shared/di';

export const subscriptionKeys = {
  plans: ['subscription', 'plans'] as const,
  current: ['subscription', 'current'] as const,
  usage: ['subscription', 'usage'] as const,
};

export function usePlansQuery() {
  const { subscription } = useRepositories();
  return useQuery<PlanInfo[]>({
    queryKey: subscriptionKeys.plans,
    queryFn: ({ signal }) => subscription.getPlans({ signal }),
    // Plan kataloqu praktiki olaraq dəyişmir.
    staleTime: 10 * 60_000,
  });
}

export function useSubscriptionQuery(enabled = true) {
  const { subscription } = useRepositories();
  return useQuery<Subscription>({
    queryKey: subscriptionKeys.current,
    queryFn: ({ signal }) => subscription.getCurrent({ signal }),
    enabled,
  });
}

export function useUsageQuery(enabled = true) {
  const { subscription } = useRepositories();
  return useQuery<DailyUsage>({
    queryKey: subscriptionKeys.usage,
    queryFn: ({ signal }) => subscription.getUsage({ signal }),
    enabled,
  });
}

/**
 * Ləğvetmə cavabı yenilənmiş abunəliyi qaytarır — ikinci GET göndərmək əvəzinə
 * cavab birbaşa keşə yazılır (mobil tətbiqdə "plan dəyişdi, UI köhnə qaldı" buquna səbəb olmuşdu).
 */
export function useCancelSubscriptionMutation() {
  const { subscription } = useRepositories();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => subscription.cancel(),
    onSuccess: updated => {
      queryClient.setQueryData(subscriptionKeys.current, updated);
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.usage });
    },
  });
}
