import { Check, X } from 'lucide-react';
import { useState } from 'react';

import type { LessonQuizQuestion } from '@/domain';
import { strings } from '@/shared/i18n/strings';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardContent } from '@/shared/ui/primitives/card';
import { Progress } from '@/shared/ui/primitives/progress';

interface LessonQuizViewProps {
  readonly questions: readonly LessonQuizQuestion[];
  readonly onReplayLesson: () => void;
}

/**
 * Variantlar backend-dən gəldiyi sırada göstərilir — YENİDƏN QARIŞDIRILMIR,
 * çünki ortaq kitabxanada hər istifadəçi eyni sıranı görməlidir.
 */
export function LessonQuizView({ questions, onReplayLesson }: LessonQuizViewProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[index];
  if (!question) return null;

  const isLast = index === questions.length - 1;
  const answered = selected !== null;

  const choose = (option: number) => {
    if (answered) return;
    setSelected(option);
    if (option === question.correctIndex) setCorrectCount(count => count + 1);
  };

  const next = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex(current => current + 1);
    setSelected(null);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
  };

  if (finished) {
    const ratio = correctCount / questions.length;
    const verdict =
      ratio === 1
        ? strings.lessons.quizPerfect
        : ratio >= 0.5
          ? strings.lessons.quizGood
          : strings.lessons.quizWeak;

    return (
      <Card className="shadow-card">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <span className="flex size-24 items-center justify-center rounded-full bg-gradient-brand text-2xl font-bold text-white">
            {strings.lessons.quizResultScore(correctCount, questions.length)}
          </span>
          <h2>{strings.lessons.quizResultTitle}</h2>
          <p className="text-[var(--color-text-muted)]">{verdict}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={restart}>{strings.lessons.quizRetry}</Button>
            <Button variant="outline" onClick={onReplayLesson}>
              {strings.lessons.replay}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            {strings.lessons.quizProgress(index + 1, questions.length)}
          </p>
          <Progress
            value={((index + (answered ? 1 : 0)) / questions.length) * 100}
            className="h-1.5"
          />
        </div>

        <h2 className="text-lg">{question.question}</h2>

        <ul className="space-y-2">
          {question.options.map((option, optionIndex) => {
            const isCorrect = optionIndex === question.correctIndex;
            const isChosen = optionIndex === selected;
            const showCorrect = answered && isCorrect;
            const showWrong = answered && isChosen && !isCorrect;

            return (
              <li key={option}>
                <button
                  type="button"
                  disabled={answered}
                  onClick={() => choose(optionIndex)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-button border px-4 py-3 text-left transition-colors',
                    showCorrect && 'border-[var(--color-success)] bg-[var(--color-success-bg)]',
                    showWrong && 'border-[var(--color-danger)] bg-[var(--color-danger-bg)]',
                    !answered && 'hover:border-[var(--color-brand)]',
                    !showCorrect && !showWrong && 'border-[var(--color-border)]',
                  )}
                >
                  <span className="flex-1">{option}</span>
                  {showCorrect && (
                    <Check className="size-4 text-[var(--color-success)]" aria-hidden />
                  )}
                  {showWrong && <X className="size-4 text-[var(--color-danger)]" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>

        {answered && (
          <div className="space-y-3">
            <div className="rounded-card bg-[var(--color-surface-variant)] p-4">
              <p className="font-semibold">
                {selected === question.correctIndex
                  ? strings.lessons.quizCorrect
                  : `${strings.lessons.quizWrong} ${question.options[question.correctIndex]}`}
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{question.explanation}</p>
            </div>
            <Button className="w-full" onClick={next}>
              {isLast ? strings.lessons.finish : strings.lessons.next}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
