import type { SubscriptionPlan } from '../models/enums';

export type PaymentAvailability = 'available' | 'coming-soon' | 'mobile-only';

export type PayablePlan = Exclude<SubscriptionPlan, 'Free'>;

/**
 * Ödəniş qatı əvəzlənə bilən moduldur (OCP):
 * AzeriCard hazır olanda yalnız implementasiya dəyişir, UI toxunulmur.
 */
export interface PaymentProvider {
  readonly availability: PaymentAvailability;
  startCheckout?(plan: PayablePlan): Promise<void>;
}
