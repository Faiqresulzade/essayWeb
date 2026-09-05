import type { EssayGrade } from './enums';

export interface Group {
  readonly id: number;
  readonly name: string;
  readonly studentCount: number;
  readonly createdAt: string;
}

export interface Student {
  readonly id: number;
  readonly groupId: number;
  readonly groupName: string;
  readonly fullName: string;
  readonly grade: EssayGrade | null;
  readonly createdAt: string;
}

export interface GroupDraft {
  readonly name: string;
}

export interface StudentDraft {
  readonly fullName: string;
  readonly grade?: EssayGrade | null;
}
