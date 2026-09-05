import { ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { EssaySummary } from '@/domain';
import { ROUTES } from '@/shared/config/routes';
import { gradeLabel } from '@/shared/i18n/labels';
import { formatDate } from '@/shared/lib/date';
import { Badge } from '@/shared/ui/primitives/badge';
import { ScoreBadge } from '@/shared/ui/ScoreBadge';

interface EssayListItemProps {
  readonly essay: EssaySummary;
}

export function EssayListItem({ essay }: EssayListItemProps) {
  return (
    <Link
      to={ROUTES.historyDetail(essay.id)}
      className="flex items-center gap-3 rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-brand)]"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-chip bg-[var(--color-surface-variant)] text-[var(--color-brand)]">
        <FileText className="size-5" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{essay.title}</p>
        <p className="truncate text-xs text-[var(--color-text-muted)]">
          {formatDate(essay.createdAt)} · {essay.wordCount} söz · {gradeLabel(essay.grade)}
        </p>
        {essay.studentName && (
          <Badge
            variant="secondary"
            className="mt-1 bg-[var(--color-info-bg)] text-[var(--color-info)]"
          >
            {essay.studentName}
          </Badge>
        )}
      </div>

      <ScoreBadge score={essay.totalScore} />
      <ChevronRight className="size-4 shrink-0 text-[var(--color-text-muted)]" aria-hidden />
    </Link>
  );
}
