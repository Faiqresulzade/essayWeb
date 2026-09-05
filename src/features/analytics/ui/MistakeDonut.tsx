import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import type { AnalyticsMistakes } from '@/domain';
import { CATEGORY_COLOR, categoryLabel } from '@/shared/i18n/labels';
import { strings } from '@/shared/i18n/strings';
import { formatDecimal, formatPercent } from '@/shared/lib/format';

interface MistakeDonutProps {
  readonly mistakes: AnalyticsMistakes;
}

export function MistakeDonut({ mistakes }: MistakeDonutProps) {
  const data = mistakes.categories.filter(category => category.count > 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-6">
        <div className="relative size-[140px] shrink-0">
          {data.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[...data]}
                  dataKey="count"
                  nameKey="category"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  isAnimationActive={false}
                >
                  {data.map(entry => (
                    <Cell key={entry.category} fill={CATEGORY_COLOR[entry.category]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold">{mistakes.total}</span>
            <span className="text-[11px] text-[var(--color-text-muted)]">
              {strings.analytics.mistakesTotal}
            </span>
          </div>
        </div>

        {/* Rəqəmlər mətn kimi də mövcuddur (yalnız vizual deyil). */}
        <ul className="flex-1 space-y-1.5">
          {mistakes.categories.map(category => (
            <li key={category.category} className="flex items-center gap-2 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_COLOR[category.category] }}
                aria-hidden
              />
              <span className="flex-1">{categoryLabel(category.category)}</span>
              <span className="text-[var(--color-text-muted)]">
                {category.count} · {formatPercent(category.share)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-[var(--color-border)] pt-3 text-center">
        <Metric label={strings.analytics.mistakesTotal} value={String(mistakes.total)} />
        <Metric
          label={strings.analytics.mistakesPerEssay}
          value={formatDecimal(mistakes.averagePerEssay)}
        />
        <Metric
          label={strings.analytics.mistakesPer100}
          value={formatDecimal(mistakes.perHundredWords)}
        />
      </div>
    </div>
  );
}

function Metric({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[11px] text-[var(--color-text-muted)]">{label}</p>
    </div>
  );
}
