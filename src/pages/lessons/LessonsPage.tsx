import { BookOpen, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { LESSON_TOPIC_MAX_CHARS, type EssayGrade } from '@/domain';
import type { LessonLibraryFilters } from '@/features/lessons/api/lessonQueries';
import {
  useCreateLessonMutation,
  useLessonLibraryQuery,
} from '@/features/lessons/api/lessonQueries';
import { useUsageQuery } from '@/features/subscription/api/subscriptionQueries';
import { LOADING_STAGE_INTERVAL_MS } from '@/shared/config/app';
import { ROUTES } from '@/shared/config/routes';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useStagedMessage } from '@/shared/hooks/useStagedMessage';
import { gradeLabel } from '@/shared/i18n/labels';
import { strings } from '@/shared/i18n/strings';
import { formatDate } from '@/shared/lib/date';
import { describeError } from '@/shared/lib/errorMessage';
import { Badge } from '@/shared/ui/primitives/badge';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardContent } from '@/shared/ui/primitives/card';
import { Input } from '@/shared/ui/primitives/input';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/primitives/tabs';
import { EmptyState, ErrorBanner, ListSkeleton, PageHeader } from '@/shared/ui/states';
import { FormField } from '@/shared/ui/FormField';

/** Kitabxanadan gələn dərs "təzə yaradılmış" sayılmır — bu həddən köhnədirsə mövcud idi. */
const FRESHLY_CREATED_WINDOW_MS = 60_000;

type OwnerFilter = 'all' | 'mine';
type GradeFilter = 'all' | EssayGrade;

export default function LessonsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: usage } = useUsageQuery();
  const createMutation = useCreateLessonMutation();

  const [topic, setTopic] = useState(searchParams.get('topic') ?? '');
  const [grade, setGrade] = useState<EssayGrade | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>('all');
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all');
  const debouncedSearch = useDebounce(search);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const filters = useMemo<LessonLibraryFilters>(
    () => ({
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
      ...(gradeFilter !== 'all' ? { grade: gradeFilter } : {}),
      ...(ownerFilter === 'mine' ? { mine: true } : {}),
    }),
    [debouncedSearch, gradeFilter, ownerFilter],
  );

  const library = useLessonLibraryQuery(filters);
  const items = library.data?.pages.flatMap(page => page.items) ?? [];

  const creatingStage = useStagedMessage(
    strings.lessons.creatingStages,
    LOADING_STAGE_INTERVAL_MS.lesson,
    createMutation.isPending,
  );

  const lessonsExhausted = Boolean(
    usage && !usage.lessons.unlimited && (usage.lessons.remaining ?? 0) <= 0,
  );

  const create = async () => {
    setError(null);
    if (!topic.trim()) {
      setError(strings.lessons.topicRequired);
      return;
    }
    if (!grade) {
      setError(strings.lessons.gradeRequired);
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const lesson = await createMutation.mutateAsync({
        command: { topic: topic.trim(), grade },
        signal: controller.signal,
      });
      const existed = Date.now() - new Date(lesson.createdAt).getTime() > FRESHLY_CREATED_WINDOW_MS;
      if (existed) toast.info(strings.lessons.existingLessonOpened);
      void navigate(ROUTES.lessonPlayer(lesson.id));
    } catch (caught) {
      setError(
        describeError(caught, {
          unprocessable: strings.lessons.notEnglishTopic,
          'limit-reached': strings.lessons.limitReached,
          'ai-unavailable': strings.lessons.aiUnavailable,
        }),
      );
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title={strings.lessons.title} subtitle={strings.lessons.subtitle} />

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <Card className="shadow-card">
        <CardContent className="space-y-4 p-5">
          <FormField id="lesson-topic" label={strings.lessons.topicLabel}>
            <Input
              id="lesson-topic"
              value={topic}
              maxLength={LESSON_TOPIC_MAX_CHARS}
              placeholder={strings.lessons.topicPlaceholder}
              onChange={event => setTopic(event.target.value)}
            />
          </FormField>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-[var(--color-text-muted)]">
              {strings.lessons.suggestionsTitle}
            </p>
            <div className="flex flex-wrap gap-2">
              {strings.lessons.suggestions.map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setTopic(suggestion)}
                  className="rounded-chip border border-[var(--color-border)] px-3 py-1 text-xs transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <FormField
            id="lesson-grade"
            label={strings.lessons.gradeRequiredLabel}
            hint={strings.lessons.gradeRequiredHint}
          >
            {/* Defolt seçim YOXDUR — sinif seçilməyincə düymə deaktivdir. */}
            <Tabs value={grade ?? ''} onValueChange={value => setGrade(value as EssayGrade)}>
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

          {usage && (
            <div className="rounded-card bg-[var(--color-surface-variant)] p-3">
              <p className="text-sm font-semibold">
                {usage.lessons.unlimited
                  ? strings.essay.dailyLimitUnlimited
                  : lessonsExhausted
                    ? strings.lessons.dailyLessonsExhausted
                    : strings.lessons.dailyLessonsLeft(
                        usage.lessons.remaining ?? 0,
                        usage.lessons.dailyLimit ?? 0,
                      )}
              </p>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {strings.lessons.dailyLessonsHint}
              </p>
            </div>
          )}

          <Button
            className="w-full"
            disabled={!topic.trim() || !grade || createMutation.isPending}
            onClick={() => void create()}
          >
            {createMutation.isPending ? creatingStage : strings.lessons.createButton}
          </Button>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2>{strings.lessons.libraryTitle}</h2>

        <Input
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder={strings.lessons.librarySearchPlaceholder}
          aria-label={strings.lessons.librarySearchPlaceholder}
        />

        <div className="flex flex-wrap gap-2">
          <Tabs value={ownerFilter} onValueChange={value => setOwnerFilter(value as OwnerFilter)}>
            <TabsList>
              <TabsTrigger value="all">{strings.lessons.filterAll}</TabsTrigger>
              <TabsTrigger value="mine">{strings.lessons.filterMine}</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs value={gradeFilter} onValueChange={value => setGradeFilter(value as GradeFilter)}>
            <TabsList>
              <TabsTrigger value="all">{strings.lessons.filterAll}</TabsTrigger>
              <TabsTrigger value="Grade9">{strings.essay.grade9}</TabsTrigger>
              <TabsTrigger value="Grade11">{strings.essay.grade11}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {library.isError && (
          <ErrorBanner
            message={describeError(library.error, { unknown: strings.lessons.loadError })}
            onRetry={() => void library.refetch()}
          />
        )}

        {library.isPending ? (
          <ListSkeleton rows={4} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={strings.lessons.emptyTitle}
            description={strings.lessons.emptySubtitle}
          />
        ) : (
          <>
            <ul className="space-y-3">
              {items.map(lesson => (
                <li key={lesson.id}>
                  <Link
                    to={ROUTES.lessonPlayer(lesson.id)}
                    className="flex items-center gap-3 rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-brand)]"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-chip bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
                      <Sparkles className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{lesson.topic}</p>
                      <p className="truncate text-xs text-[var(--color-text-muted)]">
                        {formatDate(lesson.createdAt)} · {gradeLabel(lesson.grade)} ·{' '}
                        {strings.lessons.slideCount(lesson.slideCount)}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                        {strings.lessons.createdBy(lesson.createdByName)}
                        {lesson.isMine && (
                          <Badge variant="secondary" className="text-[10px]">
                            {strings.lessons.mineBadge}
                          </Badge>
                        )}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {library.hasNextPage && (
              <Button
                variant="outline"
                className="w-full"
                disabled={library.isFetchingNextPage}
                onClick={() => void library.fetchNextPage()}
              >
                {library.isFetchingNextPage ? strings.common.loading : strings.lessons.loadMore}
              </Button>
            )}
          </>
        )}
      </section>
    </div>
  );
}
