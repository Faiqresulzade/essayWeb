import type { RequestOptions, Student, StudentDraft, StudentRepository } from '@/domain';

import type { StudentResponseDto } from '../dto/student.dto';
import { API_ROUTES } from '../http/apiRoutes';
import type { HttpClient } from '../http/HttpClient';

export class HttpStudentRepository implements StudentRepository {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async list(groupId?: number, options: RequestOptions = {}): Promise<Student[]> {
    const dto = await this.http.request<StudentResponseDto[]>({
      method: 'GET',
      url: API_ROUTES.students.root,
      query: { groupId },
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return dto ?? [];
  }

  async getById(id: number, options: RequestOptions = {}): Promise<Student> {
    return this.http.request<StudentResponseDto>({
      method: 'GET',
      url: API_ROUTES.students.byId(id),
      ...(options.signal ? { signal: options.signal } : {}),
    });
  }

  async update(id: number, draft: StudentDraft): Promise<void> {
    await this.http.request<void>({
      method: 'PUT',
      url: API_ROUTES.students.byId(id),
      body: { fullName: draft.fullName, grade: draft.grade ?? null },
    });
  }

  async remove(id: number): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      url: API_ROUTES.students.byId(id),
    });
  }
}
