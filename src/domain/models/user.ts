export interface UserIdentity {
  readonly fullName: string;
  readonly email: string;
}

export interface UserProfile extends UserIdentity {
  readonly id: number;
  readonly createdAt: string;
  readonly lastLoginDate: string | null;
}

/** Login/refresh nəticəsi: token cütü + istifadəçinin əsas məlumatı. */
export interface AuthSession {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: string;
  readonly user: UserIdentity;
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}
