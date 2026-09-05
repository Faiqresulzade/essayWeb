import type { UsageCounter } from '@/domain';
import { useUsageQuery } from '@/features/subscription/api/subscriptionQueries';
import { strings } from '@/shared/i18n/strings';
import { cn } from '@/shared/lib/cn';
import { Progress } from '@/shared/ui/primitives/progress';
import { Skeleton } from '@/shared/ui/primitives/skeleton';

interface UsageWidgetProps {
  readonly className?: string;
}

/** Sidebar altındakı gündəlik limit vidceti: esse və dərs sayğacları AYRI göstərilir. */
export function UsageWidget({ className }: UsageWidgetProps) {
  const { data, isPending } = useUsageQuery();

  if (isPending) {
    return <Skeleton className={cn('h-24 w-full rounded-card', className)} />;
  }
  if (!data) return null;

  return (
    <div
      className={cn(
        'rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] p-3',
        className,
      )}
    >
      <p className="text-xs font-semibold text-[var(--color-text-muted)]">
        {strings.essay.planCardTitle}: {data.plan}
      </p>
      <div className="mt-2 space-y-2">
        <UsageRow label={strings.essay.dailyLimitEssays} counter={data.essays} />
        <UsageRow label={strings.essay.dailyLimitLessons} counter={data.lessons} />
      </div>
    </div>
  );
}

interface UsageRowProps {
  readonly label: string;
  readonly counter: UsageCounter;
}

function UsageRow({ label, counter }: UsageRowProps) {
  const limit = counter.dailyLimit ?? 0;
  const percent = counter.unlimited || limit === 0 ? 0 : (counter.usedToday / limit) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-[var(--color-text-muted)]">{label}</span>
        <span className="font-semibold">
          {counter.unlimited ? '∞' : `${counter.usedToday} / ${limit}`}
        </span>
      </div>
      {!counter.unlimited && <Progress value={Math.min(100, percent)} className="mt-1 h-1.5" />}
    </div>
  );
}
