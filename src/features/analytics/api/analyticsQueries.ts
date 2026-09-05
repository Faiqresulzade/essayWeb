import { useQuery } from '@tanstack/react-query';

import type { GroupAnalytics, OverviewAnalytics, StudentAnalytics } from '@/domain';
import { useRepositories } from '@/shared/di';

export const analyticsKeys = {
  overview: ['analytics', 'overview'] as const,
  group: (groupId: number) => ['analytics', 'group', groupId] as const,
  student: (studentId: number) => ['analytics', 'student', studentId] as const,
};

/** Analitika sorğuları AI kvotası xərcləmir — pulsuzdur, amma yenə də keşlənir. */
export function useOverviewAnalyticsQuery() {
  const { analytics } = useRepositories();
  return useQuery<OverviewAnalytics>({
    queryKey: analyticsKeys.overview,
    queryFn: ({ signal }) => analytics.getOverview({ signal }),
  });
}

export function useGroupAnalyticsQuery(groupId: number) {
  const { analytics } = useRepositories();
  return useQuery<GroupAnalytics>({
    queryKey: analyticsKeys.group(groupId),
    queryFn: ({ signal }) => analytics.getGroup(groupId, { signal }),
  });
}

export function useStudentAnalyticsQuery(studentId: number) {
  const { analytics } = useRepositories();
  return useQuery<StudentAnalytics>({
    queryKey: analyticsKeys.student(studentId),
    queryFn: ({ signal }) => analytics.getStudent(studentId, { signal }),
  });
}
