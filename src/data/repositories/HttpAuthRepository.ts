import {
  AppError,
  type AuthRepository,
  type AuthSession,
  type LoginCommand,
  type RegisterCommand,
  type ResetPasswordCommand,
  type UserProfile,
} from '@/domain';

import type { AuthResultDto, LoginResponseDto, ProfileResponseDto } from '../dto/auth.dto';
import { API_ROUTES } from '../http/apiRoutes';
import type { HttpClient } from '../http/HttpClient';
import { toAuthSession, toUserProfile } from '../mappers/authMapper';

export class HttpAuthRepository implements AuthRepository {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async register(command: RegisterCommand): Promise<void> {
    const result = await this.http.request<AuthResultDto>({
      method: 'POST',
      url: API_ROUTES.auth.register,
      authenticated: false,
      body: {
        fullName: command.fullName,
        email: command.email,
        password: command.password,
        confirmPassword: command.confirmPassword,
        acceptTerms: command.acceptTerms,
        referralCode: command.referralCode ?? null,
        // deviceId/integrityToken vebdə göndərilmir — brauzerdə etibarlı cihaz ID-si yoxdur.
        deviceId: null,
        integrityToken: null,
      },
    });
    ensureSucceeded(result);
  }

  async login(command: LoginCommand): Promise<AuthSession> {
    const dto = await this.http.request<LoginResponseDto>({
      method: 'POST',
      url: API_ROUTES.auth.login,
      authenticated: false,
      body: command,
    });
    return toAuthSession(dto);
  }

  async refresh(refreshToken: string): Promise<AuthSession> {
    const dto = await this.http.request<LoginResponseDto>({
      method: 'POST',
      url: API_ROUTES.auth.refresh,
      authenticated: false,
      body: { refreshToken },
    });
    return toAuthSession(dto);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.http.request<void>({
      method: 'POST',
      url: API_ROUTES.auth.logout,
      body: { refreshToken },
    });
  }

  async forgotPassword(email: string): Promise<string> {
    const result = await this.http.request<AuthResultDto>({
      method: 'POST',
      url: API_ROUTES.auth.forgotPassword,
      authenticated: false,
      body: { email },
    });
    return result.message;
  }

  async resetPassword(command: ResetPasswordCommand): Promise<void> {
    const result = await this.http.request<AuthResultDto>({
      method: 'POST',
      url: API_ROUTES.auth.resetPassword,
      authenticated: false,
      body: command,
    });
    ensureSucceeded(result);
  }

  async getProfile(): Promise<UserProfile> {
    const dto = await this.http.request<ProfileResponseDto>({
      method: 'GET',
      url: API_ROUTES.auth.profile,
    });
    return toUserProfile(dto);
  }
}

/** Bəzi endpoint-lər 200 statusu ilə `succeeded: false` qaytara bilər. */
export function ensureSucceeded(result: AuthResultDto): void {
  if (result.succeeded) return;
  const message = result.message?.trim() || result.errors?.[0];
  throw new AppError('validation', {
    ...(message ? { serverMessage: message } : {}),
  });
}
