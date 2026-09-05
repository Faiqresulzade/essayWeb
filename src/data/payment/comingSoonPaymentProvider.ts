import type { PaymentProvider } from '@/domain';

/**
 * HAZIRKI VƏZİYYƏT: veb-də kartla ödəniş yoxdur (AzeriCard inteqrasiyası hazırlanır),
 * Google Play Billing isə brauzerdə işləmir. Planlar və limitlər göstərilir,
 * "abunə ol" düyməsi məlumat mesajı verir.
 *
 * AzeriCard hazır olanda YALNIZ bu fayl dəyişir, UI toxunulmur:
 *
 * export const azericardPaymentProvider: PaymentProvider = {
 *   availability: 'available',
 *   async startCheckout(plan) {
 *     const { redirectUrl } = await http.request<{ redirectUrl: string }>({
 *       method: 'POST',
 *       url: '/api/payment/azericard/checkout',
 *       body: { plan },
 *     });
 *     window.location.href = redirectUrl;
 *   },
 * };
 */
export const comingSoonPaymentProvider: PaymentProvider = {
  availability: 'coming-soon',
};
