import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/shared/config/routes';
import { strings } from '@/shared/i18n/strings';
import { Card, CardContent } from '@/shared/ui/primitives/card';

interface AuthCardProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-bg)] px-4 py-10">
      <Link to={ROUTES.landing} className="mb-6 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-chip bg-gradient-brand text-sm font-bold text-white">
          EC
        </span>
        <span className="text-lg font-bold">{strings.common.appName}</span>
      </Link>

      <Card className="w-full max-w-[420px] shadow-card">
        <CardContent className="space-y-5 p-6">
          <div className="space-y-1 text-center">
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle && <p className="text-[var(--color-text-muted)]">{subtitle}</p>}
          </div>
          {children}
        </CardContent>
      </Card>

      {footer && <div className="mt-4 text-center text-sm">{footer}</div>}
    </div>
  );
}
