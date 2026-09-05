import { useNavigate } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { TOTAL_MAX_SCORE, type StudentTrendPoint } from '@/domain';
import { ROUTES } from '@/shared/config/routes';
import { strings } from '@/shared/i18n/strings';
import { formatShortDate } from '@/shared/lib/date';
import { formatScore } from '@/shared/lib/format';

interface TrendChartProps {
  readonly points: readonly StudentTrendPoint[];
}

interface ChartPoint {
  readonly essayId: number;
  readonly label: string;
  readonly title: string;
  readonly total: number;
}

/** Nöqtəyə klik həmin esseyə keçid edir. */
export function TrendChart({ points }: TrendChartProps) {
  const navigate = useNavigate();

  const data: ChartPoint[] = points.map(point => ({
    essayId: point.essayId,
    label: formatShortDate(point.date),
    title: point.title,
    total: point.total,
  }));

  return (
    <div className="space-y-2">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
            onClick={state => {
              const index = Number(state?.activeIndex);
              const point = Number.isNaN(index) ? undefined : data[index];
              if (point) void navigate(ROUTES.historyDetail(point.essayId));
            }}
          >
            <defs>
              <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.24} />
                <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />
            <YAxis
              domain={[0, TOTAL_MAX_SCORE]}
              ticks={[0, TOTAL_MAX_SCORE / 2, TOTAL_MAX_SCORE]}
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ stroke: 'var(--color-border)' }}
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={value => [`${formatScore(Number(value))} / ${TOTAL_MAX_SCORE}`, '']}
              labelFormatter={(_label, payload) => {
                const point = payload?.[0]?.payload as ChartPoint | undefined;
                return point?.title ?? '';
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="var(--color-brand)"
              strokeWidth={2.5}
              fill="url(#trend-fill)"
              dot={{ r: 4, fill: 'var(--color-brand)' }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">{strings.analytics.trendHint}</p>
    </div>
  );
}
