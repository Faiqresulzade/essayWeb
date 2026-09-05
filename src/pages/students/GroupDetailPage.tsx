import { ArrowLeft, Pencil, Plus, Trash2, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import type { GroupAnalyticsStudent, StudentDraft } from '@/domain';
import { useGroupAnalyticsQuery } from '@/features/analytics/api/analyticsQueries';
import { DirectionBars } from '@/features/analytics/ui/DirectionBars';
import { MistakeDonut } from '@/features/analytics/ui/MistakeDonut';
import { DeltaBadge } from '@/features/analytics/ui/analyticsWidgets';
import {
  useAddStudentMutation,
  useDeleteGroupMutation,
  useGroupsQuery,
  useRenameGroupMutation,
} from '@/features/students/api/studentQueries';
import { GroupFormDialog } from '@/features/students/ui/GroupFormDialog';
import { StudentFormDialog } from '@/features/students/ui/StudentFormDialog';
import { ROUTES } from '@/shared/config/routes';
import { directionLabel } from '@/shared/i18n/labels';
import { strings } from '@/shared/i18n/strings';
import { describeError } from '@/shared/lib/errorMessage';
import { formatScore } from '@/shared/lib/format';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardContent } from '@/shared/ui/primitives/card';
import { ScoreBadge } from '@/shared/ui/ScoreBadge';
import { StatTile } from '@/shared/ui/StatTile';
import { EmptyState, ErrorBanner, ListSkeleton } from '@/shared/ui/states';

const RANK_COLORS: Readonly<Record<number, string>> = {
  1: '#D4A017',
  2: '#9AA0A6',
  3: '#B4713D',
};

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);
  const navigate = useNavigate();

  const { data: analytics, isPending, isError, error, refetch } = useGroupAnalyticsQuery(groupId);
  const { data: groups = [] } = useGroupsQuery();
  const renameGroup = useRenameGroupMutation();
  const deleteGroup = useDeleteGroupMutation();
  const addStudent = useAddStudentMutation();

  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [studentOpen, setStudentOpen] = useState(false);

  if (Number.isNaN(groupId)) return <EmptyState title={strings.students.notFound} />;
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

  const currentName = groups.find(group => group.id === groupId)?.name ?? analytics.name;

  const rename = async (name: string) => {
    try {
      await renameGroup.mutateAsync({ id: groupId, draft: { name } });
      toast.success(strings.students.groupUpdated);
      setRenameOpen(false);
    } catch (caught) {
      toast.error(describeError(caught));
    }
  };

  const remove = async () => {
    try {
      await deleteGroup.mutateAsync(groupId);
      toast.success(strings.students.groupDeleted);
      void navigate(ROUTES.students, { replace: true });
    } catch (caught) {
      toast.error(describeError(caught));
    }
  };

  const createStudent = async (draft: StudentDraft) => {
    try {
      await addStudent.mutateAsync({ groupId, draft });
      toast.success(strings.students.studentCreated);
      setStudentOpen(false);
    } catch (caught) {
      toast.error(describeError(caught));
    }
  };

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
        <h1 className="flex-1 truncate text-xl">{currentName}</h1>
        <Button
          variant="ghost"
          size="icon"
          aria-label={strings.common.edit}
          onClick={() => setRenameOpen(true)}
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

      <div className="grid grid-cols-2 gap-3">
        <StatTile
          label={strings.students.tabTitle}
          value={String(analytics.studentCount)}
          hint={strings.analytics.essayCount(analytics.essayCount)}
        />
        <StatTile
          label={strings.analytics.averageScore}
          value={formatScore(analytics.scores.total)}
          hint={`${analytics.scores.totalPercent.toFixed(0)}%`}
        />
      </div>

      {analytics.essayCount > 0 && (
        <>
          <Card className="shadow-card">
            <CardContent className="space-y-3 p-5">
              <h2>{strings.analytics.directionsTitle}</h2>
              <DirectionBars
                scores={analytics.scores}
                weakestDirection={analytics.weakestDirection}
              />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="space-y-3 p-5">
              <h2>{strings.analytics.mistakesTitle}</h2>
              <MistakeDonut mistakes={analytics.mistakes} />
            </CardContent>
          </Card>
        </>
      )}

      <Card className="shadow-card">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-2">
            <h2>{strings.analytics.studentRanking}</h2>
            <Button size="sm" variant="outline" onClick={() => setStudentOpen(true)}>
              <Plus className="size-4" />
              {strings.students.addStudent}
            </Button>
          </div>

          {analytics.students.length === 0 ? (
            <EmptyState
              icon={UserRound}
              title={strings.students.emptyStudentsTitle}
              description={strings.students.emptyStudentsSubtitle}
            />
          ) : (
            <ul className="space-y-2">
              {/* Siyahı backend-dən sıralanmış gəlir — yenidən sortlanmır. */}
              {analytics.students.map(student => (
                <li key={student.studentId}>
                  <StudentRow student={student} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <GroupFormDialog
        open={renameOpen}
        initialName={currentName}
        loading={renameGroup.isPending}
        onOpenChange={setRenameOpen}
        onSubmit={name => void rename(name)}
      />

      <StudentFormDialog
        open={studentOpen}
        loading={addStudent.isPending}
        onOpenChange={setStudentOpen}
        onSubmit={draft => void createStudent(draft)}
      />

      <ConfirmDialog
        open={deleteOpen}
        title={strings.students.deleteGroupTitle}
        description={strings.students.deleteGroupMessage(currentName)}
        confirmLabel={strings.common.delete}
        destructive
        loading={deleteGroup.isPending}
        onOpenChange={setDeleteOpen}
        onConfirm={() => {
          setDeleteOpen(false);
          void remove();
        }}
      />
    </div>
  );
}

function StudentRow({ student }: { readonly student: GroupAnalyticsStudent }) {
  const hasEssays = student.essayCount > 0;

  return (
    <Link
      to={ROUTES.studentDetail(student.studentId)}
      className="flex items-center gap-3 rounded-card border border-[var(--color-border)] p-3 transition-colors hover:border-[var(--color-brand)]"
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: RANK_COLORS[student.rank] ?? 'var(--color-text-muted)' }}
      >
        {student.rank > 0 ? student.rank : '—'}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{student.fullName}</p>
        <p className="truncate text-xs text-[var(--color-text-muted)]">
          {hasEssays
            ? `${strings.analytics.essayCount(student.essayCount)}${
                student.weakestDirection ? ` · ${directionLabel(student.weakestDirection)}` : ''
              }`
            : strings.analytics.noEssaysYet}
        </p>
      </div>

      {student.averageTotal != null && <ScoreBadge score={student.averageTotal} size="sm" />}
      <DeltaBadge delta={student.delta} />
    </Link>
  );
}
