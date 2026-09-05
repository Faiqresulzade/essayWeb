import { Clock, Filter } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { EssayHistoryFilters } from '@/features/essay/api/essayQueries';
import { useEssayHistoryPagesQuery } from '@/features/essay/api/essayQueries';
import { EssayListItem } from '@/features/history/ui/EssayListItem';
import { useGroupsQuery, useStudentsQuery } from '@/features/students/api/studentQueries';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { strings } from '@/shared/i18n/strings';
import { describeError } from '@/shared/lib/errorMessage';
import { formatScore } from '@/shared/lib/format';
import { Button } from '@/shared/ui/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu';
import { Input } from '@/shared/ui/primitives/input';
import { EmptyState, ErrorBanner, ListSkeleton, PageHeader } from '@/shared/ui/states';

type Selection =
  | { readonly kind: 'all' }
  | { readonly kind: 'group' | 'student'; readonly id: number; readonly label: string };

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [selection, setSelection] = useState<Selection>({ kind: 'all' });
  const debouncedSearch = useDebounce(search);

  const { data: groups = [] } = useGroupsQuery();
  const { data: students = [] } = useStudentsQuery();

  const filters = useMemo<EssayHistoryFilters>(
    () => ({
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
      ...(selection.kind === 'group' ? { groupId: selection.id } : {}),
      ...(selection.kind === 'student' ? { studentId: selection.id } : {}),
    }),
    [debouncedSearch, selection],
  );

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEssayHistoryPagesQuery(filters);

  const items = data?.pages.flatMap(page => page.items) ?? [];
  const summary = data?.pages[0];
  const hasRoster = groups.length > 0 || students.length > 0;
  const isFiltered = Boolean(filters.search || filters.groupId || filters.studentId);

  return (
    <div className="space-y-4">
      <PageHeader
        title={strings.history.title}
        actions={
          hasRoster && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="size-4" />
                  {selection.kind === 'all' ? strings.history.filterAll : selection.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-80 w-56 overflow-y-auto">
                <DropdownMenuItem onSelect={() => setSelection({ kind: 'all' })}>
                  {strings.history.filterAll}
                </DropdownMenuItem>
                {groups.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>{strings.students.groupsTitle}</DropdownMenuLabel>
                    {groups.map(group => (
                      <DropdownMenuItem
                        key={`group-${group.id}`}
                        onSelect={() =>
                          setSelection({ kind: 'group', id: group.id, label: group.name })
                        }
                      >
                        {group.name}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
                {students.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>{strings.students.tabTitle}</DropdownMenuLabel>
                    {students.map(student => (
                      <DropdownMenuItem
                        key={`student-${student.id}`}
                        onSelect={() =>
                          setSelection({ kind: 'student', id: student.id, label: student.fullName })
                        }
                      >
                        {student.fullName}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      />

      <Input
        value={search}
        onChange={event => setSearch(event.target.value)}
        placeholder={strings.history.searchPlaceholder}
        aria-label={strings.history.searchPlaceholder}
      />

      {isError && (
        <ErrorBanner
          message={describeError(error, { unknown: strings.history.loadError })}
          onRetry={() => void refetch()}
        />
      )}

      {isPending ? (
        <ListSkeleton rows={5} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Clock}
          title={isFiltered ? strings.history.emptySearchTitle : strings.history.emptyTitle}
          description={
            isFiltered ? strings.history.emptySearchSubtitle : strings.history.emptySubtitle
          }
        />
      ) : (
        <>
          <ul className="space-y-3">
            {items.map(essay => (
              <li key={essay.id}>
                <EssayListItem essay={essay} />
              </li>
            ))}
          </ul>

          {hasNextPage && (
            <Button
              variant="outline"
              className="w-full"
              disabled={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              {isFetchingNextPage ? strings.common.loading : strings.history.loadMore}
            </Button>
          )}

          {summary && (
            <div className="flex flex-wrap justify-between gap-2 text-sm text-[var(--color-text-muted)]">
              <span>{strings.history.totalCount(summary.totalCount)}</span>
              <span>{strings.history.averageScore(formatScore(summary.averageScore))}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
