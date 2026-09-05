import type { DailyUsage, UsageCounter } from '@/domain';
import { useCountdown } from '@/shared/hooks/useCountdown';
import { strings } from '@/shared/i18n/strings';
import { formatDuration } from '@/shared/lib/date';
import { Card, CardContent } from '@/shared/ui/primitives/card';
import { Progress } from '@/shared/ui/primitives/progress';

interface DailyLimitCardProps {
  readonly usage: DailyUsage;
}

/** Esse və dərs sayğacları bir-birindən asılı deyil — ayrı sətirlərdə göstərilir. */
export function DailyLimitCard({ usage }: DailyLimitCardProps) {
  const secondsToReset = useCountdown(usage.resetAtUtc);
  const essaysExhausted = !usage.essays.unlimited && (usage.essays.remaining ?? 0) <= 0;

  return (
    <Card className="shadow-card">
      <CardContent className="space-y-3 p-5">
        <h3>{strings.essay.dailyLimit}</h3>
        <CounterRow label={strings.essay.dailyLimitEssays} counter={usage.essays} />
        <CounterRow label={strings.essay.dailyLimitLessons} counter={usage.lessons} />
        {essaysExhausted && secondsToReset > 0 && (
          <p className="text-sm text-[var(--color-text-muted)]">
            {strings.essay.nextChanceLabel}{' '}
            <span className="font-semibold text-[var(--color-text)]">
              {formatDuration(secondsToReset)}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface CounterRowProps {
  readonly label: string;
  readonly counter: UsageCounter;
}

function CounterRow({ label, counter }: CounterRowProps) {
  if (counter.unlimited) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-text-muted)]">{label}</span>
        <span className="font-semibold">{strings.essay.dailyLimitUnlimited}</span>
      </div>
    );
  }

  const limit = counter.dailyLimit ?? 0;
  const percent = limit === 0 ? 0 : Math.min(100, (counter.usedToday / limit) * 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-text-muted)]">{label}</span>
        <span className="font-semibold">
          {strings.essay.dailyLimitUsed(counter.usedToday, limit)}
        </span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  );
}
