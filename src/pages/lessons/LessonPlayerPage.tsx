import { ArrowLeft, BookOpen, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useLessonQuery } from '@/features/lessons/api/lessonQueries';
import { LessonQuizView } from '@/features/lessons/ui/LessonQuizView';
import { LessonSlideView } from '@/features/lessons/ui/LessonSlideView';
import { gradeLabel } from '@/shared/i18n/labels';
import { strings } from '@/shared/i18n/strings';
import { describeError } from '@/shared/lib/errorMessage';
import { printCurrentPage } from '@/shared/lib/print';
import { stopSpeaking } from '@/shared/lib/speech';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardContent } from '@/shared/ui/primitives/card';
import { Progress } from '@/shared/ui/primitives/progress';
import { EmptyState, ErrorBanner, ListSkeleton } from '@/shared/ui/states';

export default function LessonPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const lessonId = Number(id);
  const navigate = useNavigate();
  const { data: lesson, isPending, isError, error, refetch } = useLessonQuery(lessonId);
  const [step, setStep] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  // Səhifədən çıxanda səsləndirmə dayandırılır.
  useEffect(() => () => stopSpeaking(), []);

  if (Number.isNaN(lessonId)) return <EmptyState title={strings.lessons.notFound} />;
  if (isPending) return <ListSkeleton rows={4} />;
  if (isError || !lesson) {
    return (
      <ErrorBanner
        message={describeError(error, {
          'not-found': strings.lessons.notFound,
          unknown: strings.lessons.loadError,
        })}
        onRetry={() => void refetch()}
      />
    );
  }

  const slides = lesson.slides;
  const totalSlides = slides.length;
  const currentSlide = slides[step];
  const isLastSlide = step === totalSlides - 1;
  const hasQuiz = lesson.quiz.length > 0;

  return (
    <article className="space-y-4">
      <header className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="no-print"
          aria-label={strings.common.back}
          onClick={() => void navigate(-1)}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl">{lesson.topic}</h1>
          <p className="truncate text-xs text-[var(--color-text-muted)]">
            {gradeLabel(lesson.grade)} · {strings.lessons.createdBy(lesson.createdByName)}
          </p>
        </div>
        {totalSlides > 0 && !quizStarted && (
          <span className="text-sm font-semibold text-[var(--color-text-muted)]">
            {strings.lessons.slideProgress(step + 1, totalSlides)}
          </span>
        )}
        <Button variant="outline" size="sm" className="no-print" onClick={printCurrentPage}>
          <Printer className="size-4" />
          {strings.lessons.exportPdf}
        </Button>
      </header>

      {totalSlides === 0 ? (
        <EmptyState icon={BookOpen} title={strings.lessons.emptyLesson} />
      ) : quizStarted ? (
        <LessonQuizView
          questions={lesson.quiz}
          onReplayLesson={() => {
            setQuizStarted(false);
            setStep(0);
          }}
        />
      ) : (
        <>
          <Progress value={((step + 1) / totalSlides) * 100} className="h-1.5" />

          <Card className="print-page shadow-card">
            <CardContent className="min-h-[320px] p-6">
              {currentSlide && <LessonSlideView slide={currentSlide} step={step} />}
            </CardContent>
          </Card>

          <div className="no-print flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              disabled={step === 0}
              onClick={() => setStep(current => Math.max(0, current - 1))}
            >
              {strings.lessons.back}
            </Button>
            {isLastSlide ? (
              hasQuiz ? (
                <Button className="flex-1" onClick={() => setQuizStarted(true)}>
                  {strings.lessons.startQuiz}
                </Button>
              ) : (
                <Button className="flex-1" onClick={() => void navigate(-1)}>
                  {strings.lessons.finish}
                </Button>
              )
            ) : (
              <Button
                className="flex-1"
                onClick={() => setStep(current => Math.min(totalSlides - 1, current + 1))}
              >
                {strings.lessons.next}
              </Button>
            )}
          </div>
        </>
      )}

      {/* Çap versiyasında bütün slaydlar və test cavabları bir yerdə görünür. */}
      <div className="hidden print:block print:space-y-6">
        {slides.map((slide, index) => (
          <section key={`print-slide-${index}`} className="print-block">
            <LessonSlideView slide={slide} step={index} />
          </section>
        ))}
        {hasQuiz && (
          <section className="print-block">
            <h2>{strings.lessons.answersTitle}</h2>
            <ol className="mt-2 space-y-2">
              {lesson.quiz.map((question, index) => (
                <li key={`print-quiz-${index}`}>
                  <p className="font-semibold">{question.question}</p>
                  <p>{question.options[question.correctIndex]}</p>
                  <p className="text-sm">{question.explanation}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </article>
  );
}
