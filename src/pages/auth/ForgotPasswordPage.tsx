import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/lib/validation';
import { AuthCard } from '@/features/auth/ui/AuthCard';
import { ROUTES } from '@/shared/config/routes';
import { useRepositories } from '@/shared/di';
import { strings } from '@/shared/i18n/strings';
import { describeError } from '@/shared/lib/errorMessage';
import { Button } from '@/shared/ui/primitives/button';
import { Input } from '@/shared/ui/primitives/input';
import { ErrorBanner } from '@/shared/ui/states';
import { FormField } from '@/shared/ui/FormField';

export default function ForgotPasswordPage() {
  const { auth } = useRepositories();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async values => {
    setError(null);
    try {
      await auth.forgotPassword(values.email.trim());
      // Cavab e-mailin mövcudluğundan asılı olmayaraq eynidir (məlumat sızmasın).
      setSent(true);
    } catch (caught) {
      setError(describeError(caught));
    }
  });

  return (
    <AuthCard
      title={strings.auth.forgotPasswordTitle}
      subtitle={strings.auth.forgotPasswordSubtitle}
      footer={
        <Link to={ROUTES.login} className="font-semibold text-[var(--color-brand)]">
          {strings.auth.backToLogin}
        </Link>
      }
    >
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {sent ? (
        <div className="space-y-4 text-center">
          <p className="rounded-card bg-[var(--color-success-bg)] px-3 py-3 text-sm text-[var(--color-success)]">
            {strings.auth.forgotPasswordSuccess}
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to={ROUTES.resetPassword}>{strings.auth.resetPasswordTitle}</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <FormField id="email" label={strings.auth.email} error={errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
          </FormField>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? strings.common.loading : strings.auth.forgotPasswordButton}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
