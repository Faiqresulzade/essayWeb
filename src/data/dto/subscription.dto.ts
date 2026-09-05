import type { SubscriptionPlan, SubscriptionPlatform } from '@/domain';

export interface PlanInfoResponseDto {
  plan: SubscriptionPlan;
  name: string;
  price: number;
  currency: string;
  period: string;
  unlimited: boolean;
  dailyLimit: number | null;
  features: string[];
}

export interface SubscriptionResponseDto {
  plan: SubscriptionPlan;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  autoRenew: boolean;
  platform: SubscriptionPlatform | null;
}

export interface DailyUsageStatusResponseDto {
  plan: SubscriptionPlan;
  unlimited: boolean;
  dailyLimit: number | null;
  usedToday: number;
  remaining: number | null;
  resetAtUtc: string;
  lessonUnlimited: boolean;
  lessonDailyLimit: number | null;
  lessonsUsedToday: number;
  lessonRemaining: number | null;
}
