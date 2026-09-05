import type { AccountRepository, ChangePasswordCommand } from '@/domain';

import type { AuthResultDto } from '../dto/auth.dto';
import { API_ROUTES } from '../http/apiRoutes';
import type { HttpClient } from '../http/HttpClient';
import { ensureSucceeded } from './HttpAuthRepository';

export class HttpAccountRepository implements AccountRepository {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async updateFullName(fullName: string): Promise<void> {
    const result = await this.http.request<AuthResultDto>({
      method: 'PUT',
      url: API_ROUTES.account.profile,
      body: { fullName },
    });
    ensureSucceeded(result);
  }

  async changePassword(command: ChangePasswordCommand): Promise<void> {
    const result = await this.http.request<AuthResultDto>({
      method: 'PUT',
      url: API_ROUTES.account.password,
      body: command,
    });
    ensureSucceeded(result);
  }

  async deleteAccount(): Promise<void> {
    const result = await this.http.request<AuthResultDto>({
      method: 'DELETE',
      url: API_ROUTES.account.root,
    });
    ensureSucceeded(result);
  }
}
