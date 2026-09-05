import type { SubscriptionPlan, SubscriptionPlatform } from './enums';

export interface PlanInfo {
  readonly plan: SubscriptionPlan;
  readonly name: string;
  readonly price: number;
  readonly currency: string;
  readonly period: string;
  readonly unlimited: boolean;
  readonly dailyLimit: number | null;
  readonly features: readonly string[];
}

export interface Subscription {
  readonly plan: SubscriptionPlan;
  readonly isActive: boolean;
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly autoRenew: boolean;
  /** "Trial" = 1 aylıq pulsuz Pro (yalnız mobil qeydiyyatda verilir). */
  readonly platform: SubscriptionPlatform | null;
}

/** Esse və dərs sayğacları tamamilə ayrıdır — ekranda da ayrı göstərilir. */
export interface UsageCounter {
  readonly unlimited: boolean;
  readonly dailyLimit: number | null;
  readonly usedToday: number;
  readonly remaining: number | null;
}

export interface DailyUsage {
  readonly plan: SubscriptionPlan;
  readonly essays: UsageCounter;
  readonly lessons: UsageCounter;
  /** Həmişə UTC gecə yarısı. */
  readonly resetAtUtc: string;
}
