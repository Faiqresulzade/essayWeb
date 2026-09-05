import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { isAppError } from '@/domain';
import { useAuthActions, useAuthStore } from '@/features/auth/model/authContext';
import { loginSchema, type LoginFormValues } from '@/features/auth/lib/validation';
import { AuthCard } from '@/features/auth/ui/AuthCard';
import { ROUTES } from '@/shared/config/routes';
import { useCountdown } from '@/shared/hooks/useCountdown';
import { strings } from '@/shared/i18n/strings';
import { formatDuration } from '@/shared/lib/date';
import { describeError } from '@/shared/lib/errorMessage';
import { PasswordInput } from '@/shared/ui/PasswordInput';
import { Button } from '@/shared/ui/primitives/button';
import { Input } from '@/shared/ui/primitives/input';
import { ErrorBanner } from '@/shared/ui/states';
import { FormField } from '@/shared/ui/FormField';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, acknowledgeExpiry } = useAuthActions();
  const sessionExpired = useAuthStore(state => state.expired);
  const [error, setError] = useState<string | null>(null);
  const [lockoutEndsAt, setLockoutEndsAt] = useState<string | null>(null);
  const lockoutSeconds = useCountdown(lockoutEndsAt);
  const isLocked = lockoutSeconds > 0;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async values => {
    setError(null);
    acknowledgeExpiry();
    try {
      await login({ email: values.email.trim(), password: values.password });
      void navigate(ROUTES.essay, { replace: true });
    } catch (caught) {
      if (isAppError(caught) && caught.code === 'account-locked' && caught.lockoutEndsAt) {
        setLockoutEndsAt(caught.lockoutEndsAt);
      }
      setError(
        describeError(caught, {
          unauthorized: strings.auth.invalidCredentials,
        }),
      );
    }
  });

  return (
    <AuthCard
      title={strings.auth.loginTitle}
      subtitle={strings.auth.loginSubtitle}
      footer={
        <span className="text-[var(--color-text-muted)]">
          {strings.auth.noAccount}{' '}
          <Link to={ROUTES.register} className="font-semibold text-[var(--color-brand)]">
            {strings.auth.registerLink}
          </Link>
        </span>
      }
    >
      {sessionExpired && !error && <ErrorBanner message={strings.common.sessionExpired} />}
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {isLocked && (
        <p className="rounded-card bg-[var(--color-warning-bg)] px-3 py-2 text-center text-sm font-semibold text-[var(--color-warning)]">
          {strings.auth.lockedOutCountdown(formatDuration(lockoutSeconds))}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormField id="email" label={strings.auth.email} error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isLocked}
            {...register('email')}
          />
        </FormField>

        <FormField id="password" label={strings.auth.password} error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            disabled={isLocked}
            {...register('password')}
          />
        </FormField>

        <div className="text-right">
          <Link
            to={ROUTES.forgotPassword}
            className="text-sm font-medium text-[var(--color-brand)]"
          >
            {strings.auth.forgotPasswordLink}
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting || isLocked}>
          {isSubmitting ? strings.common.loading : strings.auth.loginButton}
        </Button>
      </form>
    </AuthCard>
  );
}
