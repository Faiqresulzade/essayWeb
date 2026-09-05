import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { resetPasswordSchema, type ResetPasswordFormValues } from '@/features/auth/lib/validation';
import { AuthCard } from '@/features/auth/ui/AuthCard';
import { ROUTES } from '@/shared/config/routes';
import { useRepositories } from '@/shared/di';
import { strings } from '@/shared/i18n/strings';
import { describeError } from '@/shared/lib/errorMessage';
import { PasswordInput } from '@/shared/ui/PasswordInput';
import { Button } from '@/shared/ui/primitives/button';
import { Input } from '@/shared/ui/primitives/input';
import { ErrorBanner } from '@/shared/ui/states';
import { FormField } from '@/shared/ui/FormField';

export default function ResetPasswordPage() {
  const { auth } = useRepositories();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  // E-poçtdakı link `?email=...&token=...` ilə gəlir — sahələr avtomatik dolur.
  const emailFromLink = searchParams.get('email') ?? '';
  const tokenFromLink = searchParams.get('token') ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromLink,
      token: tokenFromLink,
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async values => {
    setError(null);
    try {
      await auth.resetPassword({
        email: values.email.trim(),
        token: values.token.trim(),
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      toast.success(strings.auth.resetPasswordSuccess);
      void navigate(ROUTES.login, { replace: true });
    } catch (caught) {
      setError(describeError(caught));
    }
  });

  return (
    <AuthCard
      title={strings.auth.resetPasswordTitle}
      footer={
        <Link to={ROUTES.login} className="font-semibold text-[var(--color-brand)]">
          {strings.auth.backToLogin}
        </Link>
      }
    >
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormField id="email" label={strings.auth.email} error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
        </FormField>

        <FormField id="token" label={strings.auth.resetToken} error={errors.token?.message}>
          <Input id="token" autoComplete="one-time-code" {...register('token')} />
        </FormField>

        <FormField
          id="newPassword"
          label={strings.auth.newPassword}
          error={errors.newPassword?.message}
          hint={strings.validation.passwordMin}
        >
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            {...register('newPassword')}
          />
        </FormField>

        <FormField
          id="confirmPassword"
          label={strings.auth.confirmPassword}
          error={errors.confirmPassword?.message}
        >
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? strings.common.loading : strings.auth.resetPasswordButton}
        </Button>
      </form>
    </AuthCard>
  );
}
