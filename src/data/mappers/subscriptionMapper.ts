import type { DailyUsage, PlanInfo, Subscription } from '@/domain';

import type {
  DailyUsageStatusResponseDto,
  PlanInfoResponseDto,
  SubscriptionResponseDto,
} from '../dto/subscription.dto';

export function toPlanInfo(dto: PlanInfoResponseDto): PlanInfo {
  return {
    plan: dto.plan,
    name: dto.name,
    price: dto.price,
    currency: dto.currency,
    period: dto.period,
    unlimited: dto.unlimited,
    dailyLimit: dto.dailyLimit,
    features: dto.features ?? [],
  };
}

export function toSubscription(dto: SubscriptionResponseDto): Subscription {
  return {
    plan: dto.plan,
    isActive: dto.isActive,
    startDate: dto.startDate,
    endDate: dto.endDate,
    autoRenew: dto.autoRenew,
    platform: dto.platform,
  };
}

/** İki sayğac (esse və dərs) eyni formaya salınır ki, UI onları eyni komponentlə göstərsin. */
export function toDailyUsage(dto: DailyUsageStatusResponseDto): DailyUsage {
  return {
    plan: dto.plan,
    resetAtUtc: dto.resetAtUtc,
    essays: {
      unlimited: dto.unlimited,
      dailyLimit: dto.dailyLimit,
      usedToday: dto.usedToday,
      remaining: dto.remaining,
    },
    lessons: {
      unlimited: dto.lessonUnlimited,
      dailyLimit: dto.lessonDailyLimit,
      usedToday: dto.lessonsUsedToday,
      remaining: dto.lessonRemaining,
    },
  };
}
