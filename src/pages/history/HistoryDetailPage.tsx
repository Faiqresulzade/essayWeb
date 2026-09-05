import { ArrowLeft, Check, Printer, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { MISTAKE_CATEGORIES, TOTAL_MAX_SCORE, type EssayMistakeCounts } from '@/domain';
import { useDeleteEssayMutation, useEssayQuery } from '@/features/essay/api/essayQueries';
import { CorrectedEssayText } from '@/features/history/ui/CorrectedEssayText';
import { DimScoreTable } from '@/features/history/ui/DimScoreTable';
import { MistakeList } from '@/features/history/ui/MistakeList';
import { ROUTES } from '@/shared/config/routes';
import { CATEGORY_COLOR, categoryLabel, gradeLabel } from '@/shared/i18n/labels';
import { strings } from '@/shared/i18n/strings';
import { formatDateTime } from '@/shared/lib/date';
import { describeError } from '@/shared/lib/errorMessage';
import { formatPercent } from '@/shared/lib/format';
import { printCurrentPage } from '@/shared/lib/print';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardContent } from '@/shared/ui/primitives/card';
import { ScoreBadge } from '@/shared/ui/ScoreBadge';
import { StatTile } from '@/shared/ui/StatTile';
import { EmptyState, ErrorBanner, ListSkeleton } from '@/shared/ui/states';

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const essayId = Number(id);
  const navigate = useNavigate();
  const { data: essay, isPending, isError, error, refetch } = useEssayQuery(essayId);
  const deleteMutation = useDeleteEssayMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (Number.isNaN(essayId)) {
    return <EmptyState title={strings.common.notFound} />;
  }
  if (isPending) return <ListSkeleton rows={4} />;
  if (isError || !essay) {
    return (
      <ErrorBanner
        message={describeError(error, { unknown: strings.historyDetail.loadError })}
        onRetry={() => void refetch()}
      />
    );
  }

  const remove = async () => {
    try {
      await deleteMutation.mutateAsync(essay.id);
      toast.success(strings.history.deleted);
      void navigate(ROUTES.history, { replace: true });
    } catch (caught) {
      toast.error(describeError(caught));
    }
  };

  return (
    <article className="space-y-4">
      <header className="no-print flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label={strings.common.back}
          onClick={() => void navigate(-1)}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="flex-1 truncate text-xl">{essay.title}</h1>
        <Button variant="outline" size="sm" onClick={printCurrentPage}>
          <Printer className="size-4" />
          {strings.historyDetail.exportPdf}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={strings.common.delete}
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 className="size-5 text-[var(--color-danger)]" />
        </Button>
      </header>

      <p className="text-sm text-[var(--color-text-muted)]">
        {formatDateTime(essay.createdAt)} · {gradeLabel(essay.grade)}
        {essay.studentName ? ` · ${essay.studentName}` : ''}
      </p>

      <div className="flex justify-center">
        <ScoreBadge score={essay.totalScore} size="lg" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile label={strings.historyDetail.wordCount} value={String(essay.wordCount)} />
        <StatTile
          label={strings.historyDetail.accuracy}
          value={formatPercent(essay.accuracyPercent)}
        />
        <StatTile
          label={strings.historyDetail.dimCriteria}
          value={`${essay.scores.total.toFixed(1)} / ${TOTAL_MAX_SCORE}`}
        />
      </div>

      <Card className="print-page shadow-card">
        <CardContent className="space-y-3 p-5">
          <h2>{strings.historyDetail.correctedEssay}</h2>
          <CorrectedEssayText html={essay.correctedEssay} />
        </CardContent>
      </Card>

      <Card className="print-page shadow-card">
        <CardContent className="space-y-3 p-5">
          <h2>{strings.historyDetail.mistakesStats}</h2>
          <MistakeStats statistics={essay.statistics} />
        </CardContent>
      </Card>

      <Card className="print-page shadow-card">
        <CardContent className="space-y-3 p-5">
          <h2>{strings.historyDetail.mistakes}</h2>
          <MistakeList mistakes={essay.mistakes} />
        </CardContent>
      </Card>

      <Card className="print-page shadow-card">
        <CardContent className="space-y-3 p-5">
          <h2>{strings.historyDetail.dimScoreTable}</h2>
          <DimScoreTable scores={essay.scores} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <FeedbackCard
          title={strings.historyDetail.strengths}
          items={essay.feedback.strengths}
          tone="success"
        />
        <FeedbackCard
          title={strings.historyDetail.weaknesses}
          items={essay.feedback.weaknesses}
          tone="danger"
        />
      </div>

      <FeedbackCard
        title={strings.historyDetail.recommendations}
        items={essay.feedback.recommendations}
        tone="neutral"
      />

      <ConfirmDialog
        open={confirmOpen}
        title={strings.history.deleteConfirmTitle}
        description={strings.history.deleteConfirmMessage}
        confirmLabel={strings.common.delete}
        destructive
        loading={deleteMutation.isPending}
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          setConfirmOpen(false);
          void remove();
        }}
      />
    </article>
  );
}

interface MistakeStatsProps {
  readonly statistics: EssayMistakeCounts;
}

function MistakeStats({ statistics }: MistakeStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {MISTAKE_CATEGORIES.map(category => (
        <StatTile
          key={category}
          label={categoryLabel(category)}
          value={String(statistics[category])}
          valueColor={CATEGORY_COLOR[category]}
        />
      ))}
      <StatTile
        label={strings.historyDetail.total}
        value={String(statistics.total)}
        valueColor="var(--color-brand)"
      />
    </div>
  );
}

interface FeedbackCardProps {
  readonly title: string;
  readonly items: readonly string[];
  readonly tone: 'success' | 'danger' | 'neutral';
}

function FeedbackCard({ title, items, tone }: FeedbackCardProps) {
  if (items.length === 0) return null;

  const color =
    tone === 'success'
      ? 'var(--color-success)'
      : tone === 'danger'
        ? 'var(--color-danger)'
        : 'var(--color-brand)';

  return (
    <Card className="print-page shadow-card">
      <CardContent className="space-y-2 p-5">
        <h2>{title}</h2>
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item} className="flex gap-2 text-sm">
              <span className="mt-0.5 shrink-0" style={{ color }} aria-hidden>
                {tone === 'success' ? (
                  <Check className="size-4" />
                ) : tone === 'danger' ? (
                  <X className="size-4" />
                ) : (
                  '•'
                )}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
