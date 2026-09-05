import { useState } from 'react';
import { toast } from 'sonner';

import type { PayablePlan } from '@/domain';
import {
  useCancelSubscriptionMutation,
  usePlansQuery,
  useSubscriptionQuery,
  useUsageQuery,
} from '@/features/subscription/api/subscriptionQueries';
import { DailyLimitCard } from '@/features/essay/ui/DailyLimitCard';
import { PlanCard } from '@/features/subscription/ui/PlanCard';
import { PLAY_STORE_URL } from '@/shared/config/app';
import { useServices } from '@/shared/di';
import { strings } from '@/shared/i18n/strings';
import { formatDate } from '@/shared/lib/date';
import { describeError } from '@/shared/lib/errorMessage';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { Button } from '@/shared/ui/primitives/button';
import { Skeleton } from '@/shared/ui/primitives/skeleton';
import { ErrorBanner, PageHeader } from '@/shared/ui/states';

export default function PlansPage() {
  const { paymentProvider } = useServices();
  const { data: plans, isPending, isError, error, refetch } = usePlansQuery();
  const { data: subscription } = useSubscriptionQuery();
  const { data: usage } = useUsageQuery();
  const cancelMutation = useCancelSubscriptionMutation();
  const [cancelOpen, setCancelOpen] = useState(false);

  const upgrade = (plan: PayablePlan) => {
    // Ödəniş qatı əvəzlənə biləndir: AzeriCard hazır olanda yalnız provider dəyişir.
    if (paymentProvider.availability === 'available' && paymentProvider.startCheckout) {
      void paymentProvider.startCheckout(plan).catch((caught: unknown) => {
        toast.error(describeError(caught));
      });
      return;
    }
    toast.info(strings.plans.paymentComingSoon, {
      description: strings.plans.paymentOnMobile,
      action: {
        label: strings.plans.openPlayStore,
        onClick: () => window.open(PLAY_STORE_URL, '_blank', 'noopener'),
      },
    });
  };

  const cancel = async () => {
    try {
      await cancelMutation.mutateAsync();
      toast.success(strings.plans.cancelSuccess);
    } catch (caught) {
      toast.error(describeError(caught));
    }
  };

  const isPaid = subscription && subscription.plan !== 'Free';
  const isTrial = subscription?.platform === 'Trial';

  return (
    <div className="space-y-4">
      <PageHeader title={strings.plans.title} subtitle={strings.plans.subtitle} />

      {isError && (
        <ErrorBanner
          message={describeError(error, { unknown: strings.plans.loadError })}
          onRetry={() => void refetch()}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isPending
          ? Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-72 rounded-card" />
            ))
          : plans?.map(plan => (
              <PlanCard
                key={plan.plan}
                plan={plan}
                currentPlan={subscription?.plan}
                availability={paymentProvider.availability}
                onUpgrade={upgrade}
              />
            ))}
      </div>

      {usage && <DailyLimitCard usage={usage} />}

      {subscription?.endDate && (
        <p className="text-sm text-[var(--color-text-muted)]">
          {isTrial
            ? strings.plans.trialActive(formatDate(subscription.endDate))
            : strings.plans.activeUntil(formatDate(subscription.endDate))}
        </p>
      )}

      {isPaid && (
        <Button
          variant="outline"
          className="text-[var(--color-danger)]"
          onClick={() => setCancelOpen(true)}
        >
          {strings.plans.cancelSubscription}
        </Button>
      )}

      <ConfirmDialog
        open={cancelOpen}
        title={strings.plans.cancelConfirmTitle}
        description={strings.plans.cancelConfirmMessage}
        confirmLabel={strings.plans.cancelSubscription}
        destructive
        loading={cancelMutation.isPending}
        onOpenChange={setCancelOpen}
        onConfirm={() => {
          setCancelOpen(false);
          void cancel();
        }}
      />
    </div>
  );
}
