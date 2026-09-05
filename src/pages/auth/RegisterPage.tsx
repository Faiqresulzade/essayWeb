import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuthActions } from '@/features/auth/model/authContext';
import { registerSchema, type RegisterFormValues } from '@/features/auth/lib/validation';
import { AuthCard } from '@/features/auth/ui/AuthCard';
import { ROUTES } from '@/shared/config/routes';
import { strings } from '@/shared/i18n/strings';
import { describeError } from '@/shared/lib/errorMessage';
import { PasswordInput } from '@/shared/ui/PasswordInput';
import { Button } from '@/shared/ui/primitives/button';
import { Checkbox } from '@/shared/ui/primitives/checkbox';
import { Input } from '@/shared/ui/primitives/input';
import { Label } from '@/shared/ui/primitives/label';
import { ErrorBanner } from '@/shared/ui/states';
import { FormField } from '@/shared/ui/FormField';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerAccount } = useAuthActions();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = handleSubmit(async values => {
    setError(null);
    try {
      await registerAccount({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
        acceptTerms: values.acceptTerms,
      });
      toast.success(strings.auth.registerSuccess);
      void navigate(ROUTES.login, { replace: true });
    } catch (caught) {
      setError(describeError(caught));
    }
  });

  return (
    <AuthCard
      title={strings.auth.registerTitle}
      subtitle={strings.auth.registerSubtitle}
      footer={
        <span className="text-[var(--color-text-muted)]">
          {strings.auth.haveAccount}{' '}
          <Link to={ROUTES.login} className="font-semibold text-[var(--color-brand)]">
            {strings.auth.loginLink}
          </Link>
        </span>
      }
    >
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormField id="fullName" label={strings.auth.fullName} error={errors.fullName?.message}>
          <Input id="fullName" autoComplete="name" {...register('fullName')} />
        </FormField>

        <FormField id="email" label={strings.auth.email} error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
        </FormField>

        <FormField
          id="password"
          label={strings.auth.password}
          error={errors.password?.message}
          hint={strings.validation.passwordMin}
        >
          <PasswordInput id="password" autoComplete="new-password" {...register('password')} />
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

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Controller
              name="acceptTerms"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="acceptTerms"
                  checked={field.value}
                  onCheckedChange={checked => field.onChange(checked === true)}
                />
              )}
            />
            <Label htmlFor="acceptTerms" className="text-sm font-normal">
              {strings.auth.acceptTermsPrefix}
              <Link
                to={ROUTES.terms}
                target="_blank"
                className="font-semibold text-[var(--color-brand)]"
              >
                {strings.auth.acceptTermsLink}
              </Link>
            </Label>
          </div>
          {errors.acceptTerms?.message && (
            <p role="alert" className="text-xs text-[var(--color-danger)]">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? strings.common.loading : strings.auth.registerButton}
        </Button>
      </form>
    </AuthCard>
  );
}
