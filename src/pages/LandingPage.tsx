import { BarChart3, BookOpen, PenLine, ScanText, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/model/authContext';
import { usePlansQuery } from '@/features/subscription/api/subscriptionQueries';
import { APP_VERSION, PLAY_STORE_URL } from '@/shared/config/app';
import { ROUTES } from '@/shared/config/routes';
import { strings } from '@/shared/i18n/strings';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/primitives/badge';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardContent } from '@/shared/ui/primitives/card';
import { Skeleton } from '@/shared/ui/primitives/skeleton';

const FEATURE_ICONS = [PenLine, ScanText, BookOpen, BarChart3] as const;

export default function LandingPage() {
  const isAuthenticated = useAuthStore(state => state.status === 'authenticated');
  const { data: plans, isPending } = usePlansQuery();

  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <header className="mx-auto flex w-full max-w-[1100px] items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-chip bg-gradient-brand text-sm font-bold text-white">
            EC
          </span>
          <span className="font-bold">{strings.common.appName}</span>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button asChild>
              <Link to={ROUTES.essay}>{strings.nav.essay}</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to={ROUTES.login}>{strings.landing.ctaSecondary}</Link>
              </Button>
              <Button asChild>
                <Link to={ROUTES.register}>{strings.landing.ctaPrimary}</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] space-y-16 px-4 pb-16">
        <section className="rounded-card bg-gradient-brand px-6 py-14 text-center text-white sm:px-12">
          <Badge className="bg-white/20 text-white">{strings.landing.heroBadge}</Badge>
          <h1 className="mx-auto mt-4 max-w-2xl text-3xl leading-tight font-bold sm:text-4xl">
            {strings.landing.heroTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-white/85">{strings.landing.heroSubtitle}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to={isAuthenticated ? ROUTES.essay : ROUTES.register}>
                {strings.landing.ctaPrimary}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a href={PLAY_STORE_URL} target="_blank" rel="noreferrer">
                {strings.landing.mobileCta}
              </a>
            </Button>
          </div>
        </section>

        <section>
          <h2 className="text-center">{strings.landing.featuresTitle}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {strings.landing.features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index] ?? PenLine;
              return (
                <Card key={feature.title} className="shadow-card">
                  <CardContent className="space-y-2 p-5">
                    <span className="flex size-10 items-center justify-center rounded-chip bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3>{feature.title}</h3>
                    <p className="text-[var(--color-text-muted)]">{feature.text}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-center">{strings.landing.plansTitle}</h2>
          <p className="mt-1 text-center text-[var(--color-text-muted)]">
            {strings.landing.plansSubtitle}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isPending
              ? Array.from({ length: 4 }, (_, index) => (
                  <Skeleton key={index} className="h-56 rounded-card" />
                ))
              : plans?.map(plan => (
                  <Card key={plan.plan} className="shadow-card">
                    <CardContent className="space-y-3 p-5">
                      <h3>{plan.name}</h3>
                      <p className="text-2xl font-bold">
                        {plan.price === 0
                          ? strings.plans.free
                          : formatPrice(plan.price, plan.currency)}
                        {plan.price > 0 && (
                          <span className="text-sm font-normal text-[var(--color-text-muted)]">
                            {' '}
                            {strings.plans.perMonth}
                          </span>
                        )}
                      </p>
                      <ul className="space-y-1 text-sm text-[var(--color-text-muted)]">
                        {plan.features.map(feature => (
                          <li key={feature}>• {feature}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </section>

        <section className="flex flex-col items-center gap-3 rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-8 text-center">
          <Smartphone className="size-8 text-[var(--color-brand)]" aria-hidden />
          <h2>{strings.landing.mobileTitle}</h2>
          <p className="text-[var(--color-text-muted)]">{strings.landing.mobileText}</p>
          <Button asChild variant="outline">
            <a href={PLAY_STORE_URL} target="_blank" rel="noreferrer">
              {strings.landing.mobileCta}
            </a>
          </Button>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border)] py-6">
        <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-center justify-between gap-3 px-4 text-sm text-[var(--color-text-muted)]">
          <span>
            © {new Date().getFullYear()} {strings.common.appName} — {strings.landing.footerRights}
          </span>
          <span className="flex gap-4">
            <Link to={ROUTES.privacy}>{strings.settings.privacyPolicy}</Link>
            <Link to={ROUTES.terms}>{strings.settings.termsOfService}</Link>
            <span>{strings.settings.version(APP_VERSION)}</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
