import { useState } from 'react';

import type { EssayMistake } from '@/domain';
import { CATEGORY_COLOR, categoryLabel } from '@/shared/i18n/labels';
import { strings } from '@/shared/i18n/strings';
import { Button } from '@/shared/ui/primitives/button';

const PREVIEW_COUNT = 3;

interface MistakeListProps {
  readonly mistakes: readonly EssayMistake[];
}

export function MistakeList({ mistakes }: MistakeListProps) {
  const [expanded, setExpanded] = useState(false);

  if (mistakes.length === 0) {
    return <p className="text-[var(--color-text-muted)]">{strings.historyDetail.noMistakes}</p>;
  }

  const visible = expanded ? mistakes : mistakes.slice(0, PREVIEW_COUNT);

  return (
    <div className="space-y-3">
      <ol className="space-y-3">
        {visible.map((mistake, index) => (
          <li key={`${mistake.wrong}-${index}`} className="print-block space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                {index + 1}.
              </span>
              <span className="text-[var(--color-danger)] line-through">{mistake.wrong}</span>
              <span aria-hidden>→</span>
              <span className="font-semibold text-[var(--color-success)]">{mistake.correct}</span>
              <span
                className="rounded-chip px-2 py-0.5 text-[11px] font-semibold"
                style={{
                  color: CATEGORY_COLOR[mistake.category],
                  backgroundColor: `color-mix(in srgb, ${CATEGORY_COLOR[mistake.category]} 12%, transparent)`,
                }}
              >
                {categoryLabel(mistake.category)}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">{mistake.reason}</p>
          </li>
        ))}
      </ol>

      {mistakes.length > PREVIEW_COUNT && (
        <Button
          variant="ghost"
          size="sm"
          className="no-print"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? strings.historyDetail.showLess : strings.historyDetail.showAll}
        </Button>
      )}
    </div>
  );
}
