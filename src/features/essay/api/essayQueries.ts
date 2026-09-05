import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  Essay,
  EssayHistoryPage,
  EssayHistoryQuery,
  EvaluateGrade9EssayCommand,
  EvaluateTextEssayCommand,
} from '@/domain';
import { useRepositories } from '@/shared/di';

import { subscriptionKeys } from '../../subscription/api/subscriptionQueries';

export const essayKeys = {
  history: (query: EssayHistoryQuery) => ['essays', 'history', query] as const,
  historyPages: (filters: EssayHistoryFilters) => ['essays', 'history', 'pages', filters] as const,
  detail: (id: number) => ['essays', 'detail', id] as const,
};

export type EssayHistoryFilters = Omit<EssayHistoryQuery, 'page'>;

export function useEssayHistoryQuery(query: EssayHistoryQuery) {
  const { essay } = useRepositories();
  return useQuery<EssayHistoryPage>({
    queryKey: essayKeys.history(query),
    queryFn: ({ signal }) => essay.getHistory(query, { signal }),
    placeholderData: previous => previous,
  });
}

/** "Daha çox yüklə" düyməsi üçün — sonsuz sürüşmə yoxdur, səhifə-səhifə yüklənir. */
export function useEssayHistoryPagesQuery(filters: EssayHistoryFilters) {
  const { essay } = useRepositories();
  return useInfiniteQuery({
    queryKey: essayKeys.historyPages(filters),
    queryFn: ({ pageParam, signal }) =>
      essay.getHistory({ ...filters, page: pageParam }, { signal }),
    initialPageParam: 1,
    getNextPageParam: (last: EssayHistoryPage) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
  });
}

export function useEssayQuery(id: number) {
  const { essay } = useRepositories();
  return useQuery<Essay>({
    queryKey: essayKeys.detail(id),
    queryFn: ({ signal }) => essay.getById(id, { signal }),
  });
}

/** Qiymətləndirmədən sonra tarixçə, analitika və gündəlik sayğac yenilənməlidir. */
function useInvalidateAfterEvaluation() {
  const queryClient = useQueryClient();
  return (essay: Essay) => {
    queryClient.setQueryData(essayKeys.detail(essay.id), essay);
    void queryClient.invalidateQueries({ queryKey: ['essays', 'history'] });
    void queryClient.invalidateQueries({ queryKey: ['analytics'] });
    void queryClient.invalidateQueries({ queryKey: subscriptionKeys.usage });
  };
}

export function useEvaluateTextEssayMutation() {
  const { essay } = useRepositories();
  const invalidate = useInvalidateAfterEvaluation();
  return useMutation({
    mutationFn: ({
      command,
      signal,
    }: {
      command: EvaluateTextEssayCommand;
      signal?: AbortSignal;
    }) => essay.evaluateText(command, signal ? { signal } : {}),
    onSuccess: invalidate,
  });
}

export function useEvaluateGrade9EssayMutation() {
  const { essay } = useRepositories();
  const invalidate = useInvalidateAfterEvaluation();
  return useMutation({
    mutationFn: ({
      command,
      signal,
    }: {
      command: EvaluateGrade9EssayCommand;
      signal?: AbortSignal;
    }) => essay.evaluateGrade9(command, signal ? { signal } : {}),
    onSuccess: invalidate,
  });
}

/** OCR gündəlik sayğacı artırmır — yalnız mətn qaytarır. */
export function useRecognizeTextMutation() {
  const { essay } = useRepositories();
  return useMutation({
    mutationFn: ({ image, signal }: { image: File; signal?: AbortSignal }) =>
      essay.recognizeText(image, signal ? { signal } : {}),
  });
}

export function useDeleteEssayMutation() {
  const { essay } = useRepositories();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => essay.remove(id),
    onSuccess: (_result, id) => {
      queryClient.removeQueries({ queryKey: essayKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: ['essays', 'history'] });
      void queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useClearHistoryMutation() {
  const { essay } = useRepositories();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => essay.clearHistory(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['essays'] });
      void queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
