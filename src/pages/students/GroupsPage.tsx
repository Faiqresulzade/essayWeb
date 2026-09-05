import { Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { useOverviewAnalyticsQuery } from '@/features/analytics/api/analyticsQueries';
import { useCreateGroupMutation, useGroupsQuery } from '@/features/students/api/studentQueries';
import { GroupFormDialog } from '@/features/students/ui/GroupFormDialog';
import { ROUTES } from '@/shared/config/routes';
import { strings } from '@/shared/i18n/strings';
import { describeError } from '@/shared/lib/errorMessage';
import { Button } from '@/shared/ui/primitives/button';
import { ScoreBadge } from '@/shared/ui/ScoreBadge';
import { EmptyState, ErrorBanner, ListSkeleton, PageHeader } from '@/shared/ui/states';

export default function GroupsPage() {
  const { data: groups, isPending, isError, error, refetch } = useGroupsQuery();
  const { data: overview } = useOverviewAnalyticsQuery();
  const createGroup = useCreateGroupMutation();
  const [dialogOpen, setDialogOpen] = useState(false);

  const statsFor = (groupId: number) =>
    overview?.groups.find(group => group.groupId === groupId) ?? null;

  const create = async (name: string) => {
    try {
      await createGroup.mutateAsync({ name });
      toast.success(strings.students.groupCreated);
      setDialogOpen(false);
    } catch (caught) {
      toast.error(describeError(caught));
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={strings.students.groupsTitle}
        subtitle={strings.students.groupsSubtitle}
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            {strings.students.addGroup}
          </Button>
        }
      />

      {isError && (
        <ErrorBanner
          message={describeError(error, { unknown: strings.students.loadError })}
          onRetry={() => void refetch()}
        />
      )}

      {isPending ? (
        <ListSkeleton rows={3} />
      ) : !groups || groups.length === 0 ? (
        <EmptyState
          icon={Users}
          title={strings.students.emptyGroupsTitle}
          description={strings.students.emptyGroupsSubtitle}
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="size-4" />
              {strings.students.addGroup}
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {groups.map(group => {
            const stats = statsFor(group.id);
            return (
              <li key={group.id}>
                <Link
                  to={ROUTES.groupDetail(group.id)}
                  className="flex items-center gap-3 rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-brand)]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{group.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {strings.students.studentCount(group.studentCount)}
                      {stats ? ` · ${strings.analytics.essayCount(stats.essayCount)}` : ''}
                    </p>
                  </div>
                  {stats?.averageTotal != null ? (
                    <ScoreBadge score={stats.averageTotal} />
                  ) : (
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {strings.analytics.noEssaysYet}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <GroupFormDialog
        open={dialogOpen}
        loading={createGroup.isPending}
        onOpenChange={setDialogOpen}
        onSubmit={name => void create(name)}
      />
    </div>
  );
}
