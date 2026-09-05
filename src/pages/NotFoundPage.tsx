import { FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/shared/config/routes';
import { strings } from '@/shared/i18n/strings';
import { Button } from '@/shared/ui/primitives/button';
import { EmptyState } from '@/shared/ui/states';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[var(--color-bg)] p-6">
      <EmptyState
        icon={FileQuestion}
        title={strings.common.notFound}
        description={strings.history.emptySearchSubtitle}
        action={
          <Button asChild>
            <Link to={ROUTES.landing}>{strings.common.appName}</Link>
          </Button>
        }
      />
    </div>
  );
}
