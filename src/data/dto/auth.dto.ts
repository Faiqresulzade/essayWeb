/** Backend `AuthController` cavabları — sahə adları API ilə eynidir. */

export interface LoginResponseDto {
  token: string;
  refreshToken: string;
  expiresAt: string;
  fullName: string;
  email: string;
}

export interface AuthResultDto {
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface ProfileResponseDto {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
  lastLoginDate: string | null;
}
