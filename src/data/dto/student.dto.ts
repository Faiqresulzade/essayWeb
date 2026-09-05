import type { EssayGrade } from '@/domain';

export interface GroupResponseDto {
  id: number;
  name: string;
  studentCount: number;
  createdAt: string;
}

export interface StudentResponseDto {
  id: number;
  groupId: number;
  groupName: string;
  fullName: string;
  grade: EssayGrade | null;
  createdAt: string;
}
