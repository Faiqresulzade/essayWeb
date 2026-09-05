import { ArrowLeft, FileText, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import type { StudentDraft } from '@/domain';
import { useStudentAnalyticsQuery } from '@/features/analytics/api/analyticsQueries';
import { WEAKNESS_TOPICS } from '@/features/analytics/lib/weaknessTopics';
import { DirectionBars } from '@/features/analytics/ui/DirectionBars';
import { MistakeDonut } from '@/features/analytics/ui/MistakeDonut';
import { TrendChart } from '@/features/analytics/ui/TrendChart';
import { DeltaBadge, InsightList, NotEnoughData } from '@/features/analytics/ui/analyticsWidgets';
import { useEssayHistoryQuery } from '@/features/essay/api/essayQueries';
import { EssayListItem } from '@/features/history/ui/EssayListItem';
import {
  useDeleteStudentMutation,
  useUpdateStudentMutation,
} from '@/features/students/api/studentQueries';
import { StudentFormDialog } from '@/features/students/ui/StudentFormDialog';
import { PAGE_SIZE } from '@/shared/config/app';
import { ROUTES } from '@/shared/config/routes';
import { directionLabel, gradeLabel } from '@/shared/i18n/labels';
import { strings } from '@/shared/i18n/strings';
import { describeError } from '@/shared/lib/errorMessage';
import { formatScore } from '@/shared/lib/format';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardContent } from '@/shared/ui/primitives/card';
import { ScoreBadge } from '@/shared/ui/ScoreBadge';
import { StatTile } from '@/shared/ui/StatTile';
import { EmptyState, ErrorBanner, ListSkeleton } from '@/shared/ui/states';

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id);
  const navigate = useNavigate();

  const {
    data: analytics,
    isPending,
    isError,
    error,
    refetch,
  } = useStudentAnalyticsQuery(studentId);
  const { data: history } = useEssayHistoryQuery({
    studentId,
    page: 1,
    pageSize: PAGE_SIZE.studentEssays,
  });
  const updateStudent = useUpdateStudentMutation();
  const deleteStudent = useDeleteStudentMutation();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (Number.isNaN(studentId)) return <EmptyState title={strings.students.notFound} />;
  if (isPending) return <ListSkeleton rows={4} />;
  if (isError || !analytics) {
    return (
      <ErrorBanner
        message={describeError(error, {
          'not-found': strings.students.notFound,
          unknown: strings.analytics.loadError,
        })}
        onRetry={() => void refetch()}
      />
    );
  }

  const update = async (draft: StudentDraft) => {
    try {
      await updateStudent.mutateAsync({ id: studentId, draft });
      toast.success(strings.students.studentUpdated);
      setEditOpen(false);
    } catch (caught) {
      toast.error(describeError(caught));
    }
  };

  const remove = async () => {
    try {
      await deleteStudent.mutateAsync(studentId);
      toast.success(strings.students.studentDeleted);
      void navigate(ROUTES.groupDetail(analytics.groupId), { replace: true });
    } catch (caught) {
      toast.error(describeError(caught));
    }
  };

  const weakestTopic = analytics.weakestDirection
    ? WEAKNESS_TOPICS[analytics.weakestDirection]
    : null;

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label={strings.common.back}
          onClick={() => void navigate(-1)}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="flex-1 truncate text-xl">{analytics.fullName}</h1>
        <Button
          variant="ghost"
          size="icon"
          aria-label={strings.common.edit}
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={strings.common.delete}
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="size-4 text-[var(--color-danger)]" />
        </Button>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatTile label={strings.students.groupInfo} value={analytics.groupName} />
        <StatTile label={strings.students.gradeInfo} value={gradeLabel(analytics.grade)} />
        <StatTile label={strings.students.essayCountInfo} value={String(analytics.essayCount)} />
      </div>

      <Card className="shadow-card">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="space-y-2">
            <p className="text-xs text-[var(--color-text-muted)]">
              {strings.analytics.latestScore}
            </p>
            <div className="flex items-center gap-2">
              {analytics.latestTotal != null ? (
                <ScoreBadge score={analytics.latestTotal} size="lg" />
              ) : (
                <span className="text-[var(--color-text-muted)]">
                  {strings.analytics.noEssaysYet}
                </span>
              )}
              <DeltaBadge delta={analytics.delta} />
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              {strings.analytics.averageShort(formatScore(analytics.scores.total))}
            </p>
          </div>

          {weakestTopic && analytics.weakestDirection && (
            <Link
              to={`${ROUTES.lessons}?topic=${encodeURIComponent(weakestTopic)}`}
              className="rounded-card bg-[var(--color-warning-bg)] p-4 transition-opacity hover:opacity-90"
            >
              <p className="text-xs text-[var(--color-text-muted)]">
                {strings.analytics.weakestDirection}
              </p>
              <p className="font-bold text-[var(--color-warning)]">
                {directionLabel(analytics.weakestDirection)}
              </p>
              <p className="mt-1 text-xs font-semibold text-[var(--color-brand)]">
                {strings.lessons.createFromWeakness}
              </p>
            </Link>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="space-y-3 p-5">
          <h2>{strings.analytics.trendTitle}</h2>
          {analytics.hasEnoughData ? <TrendChart points={analytics.trend} /> : <NotEnoughData />}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="space-y-3 p-5">
          <h2>{strings.analytics.directionsTitle}</h2>
          <DirectionBars scores={analytics.scores} weakestDirection={analytics.weakestDirection} />
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="space-y-3 p-5">
          <h2>{strings.analytics.mistakesTitle}</h2>
          <MistakeDonut mistakes={analytics.mistakes} />
        </CardContent>
      </Card>

      {analytics.weaknesses.length > 0 && (
        <Card className="shadow-card">
          <CardContent className="space-y-3 p-5">
            <h2>{strings.analytics.weaknessesTitle}</h2>
            <InsightList items={analytics.weaknesses} tone="danger" />
          </CardContent>
        </Card>
      )}

      {analytics.recommendations.length > 0 && (
        <Card className="shadow-card">
          <CardContent className="space-y-3 p-5">
            <h2>{strings.analytics.recommendationsTitle}</h2>
            <InsightList items={analytics.recommendations} tone="success" />
          </CardContent>
        </Card>
      )}

      <section className="space-y-3">
        <h2>{strings.students.studentEssaysTitle}</h2>
        {!history || history.items.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={strings.students.noEssaysTitle}
            description={strings.students.noEssaysSubtitle}
          />
        ) : (
          <ul className="space-y-3">
            {history.items.map(essay => (
              <li key={essay.id}>
                <EssayListItem essay={essay} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <StudentFormDialog
        open={editOpen}
        initial={{ fullName: analytics.fullName, grade: analytics.grade }}
        loading={updateStudent.isPending}
        onOpenChange={setEditOpen}
        onSubmit={draft => void update(draft)}
      />

      <ConfirmDialog
        open={deleteOpen}
        title={strings.students.deleteStudentTitle}
        description={strings.students.deleteStudentMessage(analytics.fullName)}
        confirmLabel={strings.common.delete}
        destructive
        loading={deleteStudent.isPending}
        onOpenChange={setDeleteOpen}
        onConfirm={() => {
          setDeleteOpen(false);
          void remove();
        }}
      />
    </div>
  );
}
