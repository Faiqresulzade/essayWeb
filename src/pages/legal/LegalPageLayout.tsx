import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/shared/config/routes';
import { strings } from '@/shared/i18n/strings';
import { Button } from '@/shared/ui/primitives/button';

interface LegalPageLayoutProps {
  readonly title: string;
  readonly children: ReactNode;
}

/**
 * Hüquqi səhifələr vebdə saxlanılır (mobil tətbiq bura yönləndirir),
 * ona görə ictimai və birbaşa açıla bilən marşrutlardır.
 */
export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to={ROUTES.landing}>
            <ArrowLeft className="size-4" />
            {strings.common.back}
          </Link>
        </Button>

        <article className="space-y-4 rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h1>{title}</h1>
          {children}
        </article>
      </div>
    </div>
  );
}
