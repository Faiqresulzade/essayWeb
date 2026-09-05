import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { CreateLessonCommand, Lesson, LessonLibraryQuery, LessonPage } from '@/domain';
import { useRepositories } from '@/shared/di';

import { subscriptionKeys } from '../../subscription/api/subscriptionQueries';

export type LessonLibraryFilters = Omit<LessonLibraryQuery, 'page'>;

export const lessonKeys = {
  library: (query: LessonLibraryFilters) => ['lessons', 'library', query] as const,
  detail: (id: number) => ['lessons', 'detail', id] as const,
};

/** Kitabxana səhifə-səhifə yüklənir ("Daha çox yüklə"). */
export function useLessonLibraryQuery(filters: LessonLibraryFilters) {
  const { lesson } = useRepositories();
  return useInfiniteQuery({
    queryKey: lessonKeys.library(filters),
    queryFn: ({ pageParam, signal }) =>
      lesson.getLibrary({ ...filters, page: pageParam }, { signal }),
    initialPageParam: 1,
    getNextPageParam: (last: LessonPage) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
  });
}

export function useLessonQuery(id: number) {
  const { lesson } = useRepositories();
  return useQuery<Lesson>({
    queryKey: lessonKeys.detail(id),
    queryFn: ({ signal }) => lesson.getById(id, { signal }),
    // Dərslər dəyişmir (redaktə/silmə endpoint-i yoxdur) — uzun keş münasibdir.
    staleTime: 10 * 60_000,
  });
}

/**
 * Mövzu kitabxanada varsa mövcud dərs qaytarılır və limit xərclənmir;
 * fərq yalnız `createdAt`/`isMine` ilə hiss olunur, ona görə UI-a ayrıca siqnal verilmir.
 */
export function useCreateLessonMutation() {
  const { lesson } = useRepositories();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ command, signal }: { command: CreateLessonCommand; signal?: AbortSignal }) =>
      lesson.createOrOpen(command, signal ? { signal } : {}),
    onSuccess: created => {
      queryClient.setQueryData(lessonKeys.detail(created.id), created);
      void queryClient.invalidateQueries({ queryKey: ['lessons', 'library'] });
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.usage });
    },
  });
}
