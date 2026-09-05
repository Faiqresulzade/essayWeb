import { Check, X } from 'lucide-react';

import type { LessonSlide } from '@/domain';
import { strings } from '@/shared/i18n/strings';
import { Badge } from '@/shared/ui/primitives/badge';

import { ExampleCard, SlideBody, SlideTitle, Staggered } from './slideParts';

export interface SlideProps {
  readonly slide: LessonSlide;
}

export function IntroSlide({ slide }: SlideProps) {
  return (
    <div className="space-y-4">
      <Staggered index={0}>
        <SlideTitle>{slide.title}</SlideTitle>
      </Staggered>
      {slide.body && (
        <Staggered index={1}>
          <SlideBody>{slide.body}</SlideBody>
        </Staggered>
      )}
    </div>
  );
}

export function RuleSlide({ slide }: SlideProps) {
  return (
    <div className="space-y-4">
      <Staggered index={0}>
        <SlideTitle>{slide.title}</SlideTitle>
      </Staggered>
      {slide.formula && (
        <Staggered index={1}>
          <div className="rounded-card border-2 border-[var(--color-brand)] bg-[var(--color-brand)]/5 px-4 py-3 text-center">
            <p className="text-xs font-semibold text-[var(--color-brand)]">
              {strings.lessons.ruleLabel}
            </p>
            <p className="mt-1 text-lg font-bold">{slide.formula}</p>
          </div>
        </Staggered>
      )}
      {slide.body && (
        <Staggered index={2}>
          <SlideBody>{slide.body}</SlideBody>
        </Staggered>
      )}
      {slide.keywords.length > 0 && (
        <Staggered index={3} className="space-y-2">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            {strings.lessons.keywordsLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {slide.keywords.map(keyword => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </Staggered>
      )}
    </div>
  );
}

export function ExamplesSlide({ slide }: SlideProps) {
  return (
    <div className="space-y-4">
      <Staggered index={0}>
        <SlideTitle>{slide.title}</SlideTitle>
      </Staggered>
      {slide.body && (
        <Staggered index={1}>
          <SlideBody>{slide.body}</SlideBody>
        </Staggered>
      )}
      <div className="space-y-3">
        {slide.examples.map((example, index) => (
          <Staggered key={`${example.en}-${index}`} index={index + 2}>
            <ExampleCard example={example} />
          </Staggered>
        ))}
      </div>
    </div>
  );
}

export function MistakesSlide({ slide }: SlideProps) {
  return (
    <div className="space-y-4">
      <Staggered index={0}>
        <SlideTitle>{slide.title}</SlideTitle>
      </Staggered>
      <div className="space-y-3">
        {slide.mistakes.map((mistake, index) => (
          <Staggered key={`${mistake.wrong}-${index}`} index={index + 1}>
            <div className="space-y-1 rounded-card border border-[var(--color-border)] p-4">
              <p className="flex items-center gap-2 text-[var(--color-danger)]">
                <X className="size-4 shrink-0" aria-hidden />
                <span className="line-through">{mistake.wrong}</span>
              </p>
              <p className="flex items-center gap-2 font-semibold text-[var(--color-success)]">
                <Check className="size-4 shrink-0" aria-hidden />
                {mistake.correct}
              </p>
              {mistake.note && (
                <p className="text-sm text-[var(--color-text-muted)]">{mistake.note}</p>
              )}
            </div>
          </Staggered>
        ))}
      </div>
    </div>
  );
}

export function CompareSlide({ slide }: SlideProps) {
  const comparison = slide.comparison;

  return (
    <div className="space-y-4">
      <Staggered index={0}>
        <SlideTitle>{slide.title}</SlideTitle>
      </Staggered>
      {comparison && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Staggered index={1}>
            <div className="h-full rounded-card bg-[var(--color-info-bg)] p-4">
              <h3 className="text-[var(--color-info)]">{comparison.leftTitle}</h3>
              <p className="mt-1 text-sm whitespace-pre-wrap">{comparison.leftBody}</p>
            </div>
          </Staggered>
          <Staggered index={2}>
            <div className="h-full rounded-card bg-[var(--color-warning-bg)] p-4">
              <h3 className="text-[var(--color-warning)]">{comparison.rightTitle}</h3>
              <p className="mt-1 text-sm whitespace-pre-wrap">{comparison.rightBody}</p>
            </div>
          </Staggered>
        </div>
      )}
    </div>
  );
}

export function SummarySlide({ slide }: SlideProps) {
  return (
    <div className="space-y-4">
      <Staggered index={0}>
        <SlideTitle>{slide.title}</SlideTitle>
      </Staggered>
      {slide.body && (
        <Staggered index={1}>
          <SlideBody>{slide.body}</SlideBody>
        </Staggered>
      )}
      <ul className="space-y-2">
        {slide.points.map((point, index) => (
          <Staggered key={point} index={index + 2}>
            <li className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-success)]" aria-hidden />
              <span>{point}</span>
            </li>
          </Staggered>
        ))}
      </ul>
    </div>
  );
}
