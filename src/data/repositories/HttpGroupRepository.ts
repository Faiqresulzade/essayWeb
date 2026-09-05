import type {
  Group,
  GroupDraft,
  GroupRepository,
  RequestOptions,
  Student,
  StudentDraft,
} from '@/domain';

import type { GroupResponseDto, StudentResponseDto } from '../dto/student.dto';
import { API_ROUTES } from '../http/apiRoutes';
import type { HttpClient } from '../http/HttpClient';

export class HttpGroupRepository implements GroupRepository {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async list(options: RequestOptions = {}): Promise<Group[]> {
    const dto = await this.http.request<GroupResponseDto[]>({
      method: 'GET',
      url: API_ROUTES.groups.root,
      ...(options.signal ? { signal: options.signal } : {}),
    });
    return dto ?? [];
  }

  async create(draft: GroupDraft): Promise<Group> {
    return this.http.request<GroupResponseDto>({
      method: 'POST',
      url: API_ROUTES.groups.root,
      body: draft,
    });
  }

  async rename(id: number, draft: GroupDraft): Promise<void> {
    await this.http.request<void>({
      method: 'PUT',
      url: API_ROUTES.groups.byId(id),
      body: draft,
    });
  }

  async remove(id: number): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      url: API_ROUTES.groups.byId(id),
    });
  }

  async addStudent(groupId: number, draft: StudentDraft): Promise<Student> {
    return this.http.request<StudentResponseDto>({
      method: 'POST',
      url: API_ROUTES.groups.students(groupId),
      body: { fullName: draft.fullName, grade: draft.grade ?? null },
    });
  }
}
