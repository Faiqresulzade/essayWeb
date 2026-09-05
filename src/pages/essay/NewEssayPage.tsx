import { ArrowRight, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
  ESSAY_TEXT_MAX_CHARS,
  ESSAY_TOPIC_MAX_CHARS,
  OCR_MAX_PAGES,
  resolveGrade,
  supportsTopic,
  type EssayGrade,
} from '@/domain';
import { useEssayEvaluation } from '@/features/essay/model/useEssayEvaluation';
import { useOcrRecognition } from '@/features/essay/model/useOcrRecognition';
import { DailyLimitCard } from '@/features/essay/ui/DailyLimitCard';
import { ImageDropzone } from '@/features/essay/ui/ImageDropzone';
import { StudentPicker } from '@/features/essay/ui/StudentPicker';
import { useGroupsQuery, useStudentsQuery } from '@/features/students/api/studentQueries';
import { useUsageQuery } from '@/features/subscription/api/subscriptionQueries';
import { LOADING_STAGE_INTERVAL_MS } from '@/shared/config/app';
import { ROUTES } from '@/shared/config/routes';
import { useStagedMessage } from '@/shared/hooks/useStagedMessage';
import { gradeLabel } from '@/shared/i18n/labels';
import { strings } from '@/shared/i18n/strings';
import { cn } from '@/shared/lib/cn';
import { describeError } from '@/shared/lib/errorMessage';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/primitives/accordion';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardContent } from '@/shared/ui/primitives/card';
import { Input } from '@/shared/ui/primitives/input';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/primitives/tabs';
import { Textarea } from '@/shared/ui/primitives/textarea';
import { ErrorBanner, PageHeader } from '@/shared/ui/states';
import { FormField } from '@/shared/ui/FormField';

type InputMode = 'text' | 'image';

export default function NewEssayPage() {
  const navigate = useNavigate();
  const { data: usage } = useUsageQuery();
  const { data: groups = [] } = useGroupsQuery();
  const { data: students = [] } = useStudentsQuery();
  const { evaluate, isPending: isEvaluating } = useEssayEvaluation();
  const { recognize, progress: ocrProgress, isPending: isRecognizing } = useOcrRecognition();

  const [studentId, setStudentId] = useState<number | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<EssayGrade>('Grade11');
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('');
  const [pages, setPages] = useState<File[]>([]);
  const [promptImage, setPromptImage] = useState<File[]>([]);
  const [fromImage, setFromImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedStudent = useMemo(
    () => students.find(student => student.id === studentId) ?? null,
    [students, studentId],
  );
  const effectiveGrade = resolveGrade(selectedGrade, selectedStudent?.grade) ?? selectedGrade;
  const gradeLocked = Boolean(selectedStudent?.grade);
  const hasRoster = groups.length > 0 || students.length > 0;

  const limitReached = Boolean(
    usage && !usage.essays.unlimited && (usage.essays.remaining ?? 0) <= 0,
  );
  const tooLong = text.length > ESSAY_TEXT_MAX_CHARS;
  const canSubmit = text.trim().length > 0 && !tooLong && !limitReached && !isEvaluating;

  const loadingStage = useStagedMessage(
    strings.essay.evaluatingStages,
    LOADING_STAGE_INTERVAL_MS.essay,
    isEvaluating,
  );

  const runOcr = async () => {
    setError(null);
    try {
      const recognized = await recognize(pages);
      if (!recognized) {
        setError(strings.essay.ocrEmpty);
        return;
      }
      setText(current => (current.trim() ? `${current}\n\n${recognized}` : recognized));
      setFromImage(true);
      setInputMode('text');
      toast.success(strings.essay.ocrSuccess);
    } catch (caught) {
      setError(
        describeError(caught, {
          forbidden: strings.essay.ocrFailed,
          unprocessable: strings.essay.ocrFailed,
          'limit-reached': strings.essay.limitReachedMessage,
        }),
      );
    }
  };

  const submit = async () => {
    setError(null);
    if (!canSubmit) return;

    try {
      const essay = await evaluate({
        text: text.trim(),
        grade: effectiveGrade,
        fromImage,
        ...(supportsTopic(effectiveGrade) && topic.trim() ? { topic: topic.trim() } : {}),
        ...(studentId !== null ? { studentId } : {}),
        ...(effectiveGrade === 'Grade9' && promptImage[0] ? { promptImage: promptImage[0] } : {}),
      });
      setText('');
      setTopic('');
      setPages([]);
      setPromptImage([]);
      setFromImage(false);
      void navigate(ROUTES.historyDetail(essay.id));
    } catch (caught) {
      setError(
        describeError(caught, {
          unprocessable: strings.essay.notAnEssay,
          'limit-reached': strings.essay.limitReachedMessage,
          'ai-unavailable': strings.essay.aiUnavailable,
          validation: strings.essay.studentNotFound,
        }),
      );
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title={strings.essay.title} subtitle={strings.essay.subtitle} />

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <Card className="shadow-card">
        <CardContent className="space-y-4 p-5">
          {hasRoster && (
            <StudentPicker
              groups={groups}
              students={students}
              value={studentId}
              onChange={setStudentId}
            />
          )}

          {gradeLocked && selectedStudent?.grade ? (
            <p className="rounded-chip bg-[var(--color-info-bg)] px-3 py-2 text-sm text-[var(--color-text)]">
              {strings.studentPicker.gradeAuto(gradeLabel(selectedStudent.grade))}
            </p>
          ) : (
            <FormField id="grade" label={strings.essay.gradeLabel}>
              <Tabs
                value={selectedGrade}
                onValueChange={value => setSelectedGrade(value as EssayGrade)}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="Grade9" className="flex-1">
                    {strings.essay.grade9}
                  </TabsTrigger>
                  <TabsTrigger value="Grade11" className="flex-1">
                    {strings.essay.grade11}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </FormField>
          )}

          <Tabs value={inputMode} onValueChange={value => setInputMode(value as InputMode)}>
            <TabsList className="w-full">
              <TabsTrigger value="text" className="flex-1">
                {strings.essay.tabText}
              </TabsTrigger>
              <TabsTrigger value="image" className="flex-1">
                {strings.essay.tabImage}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="space-y-4 p-5">
          {supportsTopic(effectiveGrade) && (
            <FormField id="topic" label={strings.essay.topicLabel}>
              <Input
                id="topic"
                value={topic}
                maxLength={ESSAY_TOPIC_MAX_CHARS}
                placeholder={strings.essay.topicPlaceholder}
                onChange={event => setTopic(event.target.value)}
              />
            </FormField>
          )}

          {inputMode === 'image' ? (
            <div className="space-y-3">
              <ImageDropzone
                files={pages}
                maxFiles={OCR_MAX_PAGES}
                disabled={isRecognizing}
                onChange={setPages}
                onError={setError}
              />
              <p className="text-xs text-[var(--color-text-muted)]">{strings.essay.twoPagesHint}</p>
              <Button
                type="button"
                className="w-full"
                disabled={pages.length === 0 || isRecognizing}
                onClick={() => void runOcr()}
              >
                {isRecognizing
                  ? ocrProgress
                    ? strings.essay.ocrPageProgress(ocrProgress.current, ocrProgress.total)
                    : strings.essay.ocrProcessing
                  : strings.essay.tabImage}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Textarea
                aria-label={strings.essay.title}
                value={text}
                onChange={event => setText(event.target.value)}
                placeholder={strings.essay.placeholder}
                className="min-h-[320px] resize-y lg:min-h-[400px]"
              />
              <p
                className={cn(
                  'text-right text-xs',
                  tooLong
                    ? 'font-semibold text-[var(--color-danger)]'
                    : 'text-[var(--color-text-muted)]',
                )}
              >
                {strings.essay.charCount(text.length, ESSAY_TEXT_MAX_CHARS)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {effectiveGrade === 'Grade9' && (
        <Card className="shadow-card">
          <CardContent className="space-y-3 p-5">
            <h3>{strings.essay.grade9BonusTitle}</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              {strings.essay.grade9ImagesHint}
            </p>
            <ImageDropzone
              files={promptImage}
              maxFiles={1}
              onChange={setPromptImage}
              onError={setError}
            />
          </CardContent>
        </Card>
      )}

      {limitReached && <ErrorBanner message={strings.essay.limitReachedMessage} />}

      <Button size="lg" className="w-full" disabled={!canSubmit} onClick={() => void submit()}>
        {isEvaluating ? loadingStage : strings.essay.evaluateButton}
      </Button>

      {usage && <DailyLimitCard usage={usage} />}

      <Link to={ROUTES.lessons} className="block">
        <Card className="bg-gradient-brand text-white shadow-card transition-transform hover:scale-[1.01]">
          <CardContent className="flex items-center gap-4 p-5">
            <Sparkles className="size-8 shrink-0" aria-hidden />
            <div className="flex-1">
              <h3>{strings.essay.lessonCardTitle}</h3>
              <p className="text-white/85">{strings.essay.lessonCardText}</p>
            </div>
            <ArrowRight className="size-5 shrink-0" aria-hidden />
          </CardContent>
        </Card>
      </Link>

      <Accordion type="single" collapsible>
        <AccordionItem
          value="criteria"
          className="rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] px-4"
        >
          <AccordionTrigger>{strings.essay.criteriaTitle}</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <ul className="space-y-1 text-sm text-[var(--color-text-muted)]">
              {strings.essay.criteriaItems.map(item => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <p className="text-xs text-[var(--color-text-muted)]">
              {strings.essay.criteriaDisclaimer}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
