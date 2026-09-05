import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Group, GroupDraft, Student, StudentDraft } from '@/domain';
import { useRepositories } from '@/shared/di';

export const studentKeys = {
  groups: ['groups'] as const,
  students: (groupId?: number) => ['students', groupId ?? 'all'] as const,
  student: (id: number) => ['students', 'detail', id] as const,
};

export function useGroupsQuery(enabled = true) {
  const { group } = useRepositories();
  return useQuery<Group[]>({
    queryKey: studentKeys.groups,
    queryFn: ({ signal }) => group.list({ signal }),
    enabled,
  });
}

export function useStudentsQuery(groupId?: number, enabled = true) {
  const { student } = useRepositories();
  return useQuery<Student[]>({
    queryKey: studentKeys.students(groupId),
    queryFn: ({ signal }) => student.list(groupId, { signal }),
    enabled,
  });
}

export function useStudentQuery(id: number) {
  const { student } = useRepositories();
  return useQuery<Student>({
    queryKey: studentKeys.student(id),
    queryFn: ({ signal }) => student.getById(id, { signal }),
  });
}

/**
 * Mutasiyadan sonra qrup/şagird siyahıları HƏMİŞƏ etibarsız sayılır —
 * əks halda köhnə cavab ekranda qalır (mobil tətbiqdə real bug olub).
 */
function useInvalidateRoster() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: studentKeys.groups });
    void queryClient.invalidateQueries({ queryKey: ['students'] });
    void queryClient.invalidateQueries({ queryKey: ['analytics'] });
  };
}

export function useCreateGroupMutation() {
  const { group } = useRepositories();
  const invalidate = useInvalidateRoster();
  return useMutation({
    mutationFn: (draft: GroupDraft) => group.create(draft),
    onSuccess: invalidate,
  });
}

export function useRenameGroupMutation() {
  const { group } = useRepositories();
  const invalidate = useInvalidateRoster();
  return useMutation({
    mutationFn: ({ id, draft }: { id: number; draft: GroupDraft }) => group.rename(id, draft),
    onSuccess: invalidate,
  });
}

export function useDeleteGroupMutation() {
  const { group } = useRepositories();
  const invalidate = useInvalidateRoster();
  return useMutation({
    mutationFn: (id: number) => group.remove(id),
    onSuccess: invalidate,
  });
}

export function useAddStudentMutation() {
  const { group } = useRepositories();
  const invalidate = useInvalidateRoster();
  return useMutation({
    mutationFn: ({ groupId, draft }: { groupId: number; draft: StudentDraft }) =>
      group.addStudent(groupId, draft),
    onSuccess: invalidate,
  });
}

export function useUpdateStudentMutation() {
  const { student } = useRepositories();
  const invalidate = useInvalidateRoster();
  return useMutation({
    mutationFn: ({ id, draft }: { id: number; draft: StudentDraft }) => student.update(id, draft),
    onSuccess: invalidate,
  });
}

export function useDeleteStudentMutation() {
  const { student } = useRepositories();
  const invalidate = useInvalidateRoster();
  return useMutation({
    mutationFn: (id: number) => student.remove(id),
    onSuccess: invalidate,
  });
}
