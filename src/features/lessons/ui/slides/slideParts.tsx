import { Volume2 } from 'lucide-react';
import type { ReactNode } from 'react';

import type { LessonExample } from '@/domain';
import { strings } from '@/shared/i18n/strings';
import { cn } from '@/shared/lib/cn';
import { isSpeechSupported, speakEnglish } from '@/shared/lib/speech';
import { Button } from '@/shared/ui/primitives/button';

interface StaggeredProps {
  readonly index?: number;
  readonly className?: string;
  readonly children: ReactNode;
}

/** Elementlər ardıcıl görünür (fade + yuxarı sürüşmə). */
export function Staggered({ index = 0, className, children }: StaggeredProps) {
  return (
    <div
      className={cn('animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards', className)}
      style={{ animationDelay: `${index * 90}ms`, animationDuration: '320ms' }}
    >
      {children}
    </div>
  );
}

export function SlideTitle({ children }: { readonly children: ReactNode }) {
  return <h2 className="text-2xl">{children}</h2>;
}

export function SlideBody({ children }: { readonly children: ReactNode }) {
  return <p className="text-[15px] leading-7 whitespace-pre-wrap">{children}</p>;
}

interface ExampleCardProps {
  readonly example: LessonExample;
}

/** İngilis cümləsi səsləndirilə bilər; `highlight` tapılmasa sadəcə vurğulanmır. */
export function ExampleCard({ example }: ExampleCardProps) {
  const canSpeak = isSpeechSupported();

  return (
    <div className="rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-start gap-3">
        <p className="flex-1 text-[15px] font-medium">{highlightedSentence(example)}</p>
        {canSpeak && (
          <Button
            variant="ghost"
            size="icon"
            aria-label={strings.lessons.speakHint}
            onClick={() => speakEnglish(example.en)}
          >
            <Volume2 className="size-4 text-[var(--color-brand)]" />
          </Button>
        )}
      </div>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">{example.az}</p>
    </div>
  );
}

function highlightedSentence(example: LessonExample): ReactNode {
  const { en, highlight } = example;
  if (!highlight) return en;

  const start = en.indexOf(highlight);
  if (start === -1) return en;

  return (
    <>
      {en.slice(0, start)}
      <span className="underline decoration-[var(--color-brand)] decoration-2 underline-offset-4">
        {highlight}
      </span>
      {en.slice(start + highlight.length)}
    </>
  );
}
