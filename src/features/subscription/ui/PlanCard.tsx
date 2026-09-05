import { Check } from 'lucide-react';

import type { PayablePlan, PaymentAvailability, PlanInfo, SubscriptionPlan } from '@/domain';
import { PLAY_STORE_URL } from '@/shared/config/app';
import { strings } from '@/shared/i18n/strings';
import { cn } from '@/shared/lib/cn';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/primitives/badge';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardContent } from '@/shared/ui/primitives/card';

const UPGRADE_LABELS: Readonly<Record<PayablePlan, string>> = {
  Pro: strings.plans.upgradeToPro,
  ProPlus: strings.plans.upgradeToProPlus,
  Premium: strings.plans.upgradeToPremium,
};

interface PlanCardProps {
  readonly plan: PlanInfo;
  readonly currentPlan: SubscriptionPlan | undefined;
  readonly availability: PaymentAvailability;
  readonly onUpgrade: (plan: PayablePlan) => void;
}

export function PlanCard({ plan, currentPlan, availability, onUpgrade }: PlanCardProps) {
  const isCurrent = plan.plan === currentPlan;
  const isFree = plan.plan === 'Free';
  const isHighlighted = plan.plan === 'Premium';

  return (
    <Card
      className={cn(
        'relative h-full shadow-card',
        isHighlighted && 'border-2 border-[var(--color-brand)]',
      )}
    >
      {isHighlighted && (
        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-brand text-[10px] text-white">
          {strings.plans.bestValue}
        </Badge>
      )}

      <CardContent className="flex h-full flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <h3>{plan.name}</h3>
          {isCurrent && <Badge variant="secondary">{strings.plans.currentPlan}</Badge>}
        </div>

        <p className="text-2xl font-bold">
          {isFree ? strings.plans.free : formatPrice(plan.price, plan.currency)}
          {!isFree && (
            <span className="text-sm font-normal text-[var(--color-text-muted)]">
              {' '}
              {strings.plans.perMonth}
            </span>
          )}
        </p>

        <ul className="flex-1 space-y-1.5">
          {plan.features.map(feature => (
            <li key={feature} className="flex gap-2 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-success)]" aria-hidden />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {availability === 'mobile-only' && !isFree && !isCurrent ? (
          <Button asChild variant="outline" className="w-full">
            <a href={PLAY_STORE_URL} target="_blank" rel="noreferrer">
              {strings.plans.openPlayStore}
            </a>
          </Button>
        ) : (
          <Button
            className="w-full"
            variant={isHighlighted ? 'default' : 'outline'}
            disabled={isCurrent || isFree}
            onClick={() => !isFree && onUpgrade(plan.plan as PayablePlan)}
          >
            {isCurrent
              ? strings.plans.currentPlan
              : isFree
                ? strings.plans.free
                : UPGRADE_LABELS[plan.plan as PayablePlan]}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
