import type { AuthSession, UserProfile } from '@/domain';

import type { LoginResponseDto, ProfileResponseDto } from '../dto/auth.dto';

export function toAuthSession(dto: LoginResponseDto): AuthSession {
  return {
    accessToken: dto.token,
    refreshToken: dto.refreshToken,
    expiresAt: dto.expiresAt,
    user: { fullName: dto.fullName, email: dto.email },
  };
}

export function toUserProfile(dto: ProfileResponseDto): UserProfile {
  return {
    id: dto.id,
    fullName: dto.fullName,
    email: dto.email,
    createdAt: dto.createdAt,
    lastLoginDate: dto.lastLoginDate,
  };
}
