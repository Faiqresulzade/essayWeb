import { BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useOverviewAnalyticsQuery } from '@/features/analytics/api/analyticsQueries';
import { DirectionBars } from '@/features/analytics/ui/DirectionBars';
import { MistakeDonut } from '@/features/analytics/ui/MistakeDonut';
import { InsightList } from '@/features/analytics/ui/analyticsWidgets';
import { ROUTES } from '@/shared/config/routes';
import { directionLabel } from '@/shared/i18n/labels';
import { strings } from '@/shared/i18n/strings';
import { describeError } from '@/shared/lib/errorMessage';
import { formatPercent, formatScore } from '@/shared/lib/format';
import { Card, CardContent } from '@/shared/ui/primitives/card';
import { ScoreBadge } from '@/shared/ui/ScoreBadge';
import { StatTile } from '@/shared/ui/StatTile';
import { EmptyState, ErrorBanner, ListSkeleton, PageHeader } from '@/shared/ui/states';

export default function OverviewPage() {
  const { data, isPending, isError, error, refetch } = useOverviewAnalyticsQuery();

  if (isPending) return <ListSkeleton rows={4} />;
  if (isError || !data) {
    return (
      <ErrorBanner
        message={describeError(error, { unknown: strings.analytics.loadError })}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={strings.analytics.overviewTitle}
        subtitle={strings.analytics.overviewSubtitle}
      />

      {data.essayCount === 0 ? (
        <EmptyState
          icon={BarChart3}
          title={strings.analytics.noEssaysYet}
          description={strings.history.emptySubtitle}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
              label={strings.analytics.totalEssays}
              value={String(data.essayCount)}
              hint={strings.analytics.studentEssays(data.essaysWithStudent)}
            />
            <StatTile
              label={strings.analytics.averageScore}
              value={formatScore(data.scores.total)}
              hint={formatPercent(data.scores.totalPercent)}
            />
            <StatTile label={strings.analytics.last30Days} value={String(data.essaysLast30Days)} />
            <StatTile
              label={strings.analytics.weakestDirection}
              value={data.weakestDirection ? directionLabel(data.weakestDirection) : '—'}
              valueColor="var(--color-warning)"
            />
          </div>

          <div className="grid gap-4 2xl:grid-cols-2">
            <Card className="shadow-card">
              <CardContent className="space-y-3 p-5">
                <h2>{strings.analytics.directionsTitle}</h2>
                <DirectionBars scores={data.scores} weakestDirection={data.weakestDirection} />
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="space-y-3 p-5">
                <h2>{strings.analytics.mistakesTitle}</h2>
                <MistakeDonut mistakes={data.mistakes} />
              </CardContent>
            </Card>
          </div>

          {data.weaknesses.length > 0 && (
            <Card className="shadow-card">
              <CardContent className="space-y-3 p-5">
                <h2>{strings.analytics.weaknessesTitle}</h2>
                <InsightList items={data.weaknesses} tone="danger" />
              </CardContent>
            </Card>
          )}

          {data.recommendations.length > 0 && (
            <Card className="shadow-card">
              <CardContent className="space-y-3 p-5">
                <h2>{strings.analytics.recommendationsTitle}</h2>
                <InsightList items={data.recommendations} tone="success" />
              </CardContent>
            </Card>
          )}

          {data.groups.length > 0 && (
            <Card className="shadow-card">
              <CardContent className="space-y-3 p-5">
                <h2>{strings.analytics.groupsTitle}</h2>
                <ul className="space-y-2">
                  {data.groups.map(group => (
                    <li key={group.groupId}>
                      <Link
                        to={ROUTES.groupDetail(group.groupId)}
                        className="flex items-center gap-3 rounded-card border border-[var(--color-border)] p-3 transition-colors hover:border-[var(--color-brand)]"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{group.name}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {strings.students.studentCount(group.studentCount)} ·{' '}
                            {strings.analytics.essayCount(group.essayCount)}
                          </p>
                        </div>
                        {group.averageTotal != null ? (
                          <ScoreBadge score={group.averageTotal} size="sm" />
                        ) : (
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {strings.analytics.noEssaysYet}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
