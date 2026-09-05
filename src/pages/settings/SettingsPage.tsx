import { yupResolver } from '@hookform/resolvers/yup';
import { Mail, MessageCircle, Monitor, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { useLogout } from '@/features/auth/api/useLogout';
import { useAuthActions, useAuthStore } from '@/features/auth/model/authContext';
import {
  changePasswordSchema,
  profileSchema,
  type ChangePasswordFormValues,
  type ProfileFormValues,
} from '@/features/auth/lib/validation';
import { useClearHistoryMutation } from '@/features/essay/api/essayQueries';
import { APP_VERSION, CONTACT } from '@/shared/config/app';
import { ROUTES } from '@/shared/config/routes';
import { useRepositories } from '@/shared/di';
import { strings } from '@/shared/i18n/strings';
import { describeError } from '@/shared/lib/errorMessage';
import { initials } from '@/shared/lib/format';
import { useThemeStore, type ThemeMode } from '@/shared/theme/themeStore';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { Avatar, AvatarFallback } from '@/shared/ui/primitives/avatar';
import { Button } from '@/shared/ui/primitives/button';
import { Card, CardContent } from '@/shared/ui/primitives/card';
import { PasswordInput } from '@/shared/ui/PasswordInput';
import { Input } from '@/shared/ui/primitives/input';
import { PageHeader } from '@/shared/ui/states';
import { FormField } from '@/shared/ui/FormField';

const THEME_OPTIONS: readonly { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: 'system', label: strings.settings.themeSystem, icon: Monitor },
  { mode: 'light', label: strings.settings.themeLight, icon: Sun },
  { mode: 'dark', label: strings.settings.themeDark, icon: Moon },
];

export default function SettingsPage() {
  const { account } = useRepositories();
  const user = useAuthStore(state => state.user);
  const { setUser } = useAuthActions();
  const { logout } = useLogout();
  const { mode, setMode } = useThemeStore();
  const clearHistory = useClearHistoryMutation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),
    defaultValues: { fullName: user?.fullName ?? '' },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const saveProfile = profileForm.handleSubmit(async values => {
    try {
      await account.updateFullName(values.fullName.trim());
      if (user) setUser({ ...user, fullName: values.fullName.trim() });
      toast.success(strings.settings.profileUpdated);
      setProfileOpen(false);
    } catch (caught) {
      toast.error(describeError(caught));
    }
  });

  const savePassword = passwordForm.handleSubmit(async values => {
    try {
      await account.changePassword(values);
      toast.success(strings.settings.passwordUpdated);
      passwordForm.reset();
      setPasswordOpen(false);
      // Şifrə dəyişəndə bütün refresh tokenlər ləğv olunur — yenidən giriş tələb olunur.
      await logout();
    } catch (caught) {
      toast.error(describeError(caught));
    }
  });

  const removeHistory = async () => {
    try {
      await clearHistory.mutateAsync();
      toast.success(strings.settings.historyCleared);
    } catch (caught) {
      toast.error(describeError(caught));
    }
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await account.deleteAccount();
      toast.success(strings.settings.accountDeleted);
      await logout();
    } catch (caught) {
      toast.error(describeError(caught));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title={strings.settings.title} />

      <Card className="shadow-card">
        <CardContent className="flex items-center gap-4 p-5">
          <Avatar className="size-12">
            <AvatarFallback className="bg-[var(--color-brand)]/10 font-semibold text-[var(--color-brand)]">
              {initials(user?.fullName ?? '')}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold">{user?.fullName}</p>
            <p className="truncate text-sm text-[var(--color-text-muted)]">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="space-y-3 p-5">
          <h2>{strings.settings.profileSection}</h2>

          {profileOpen ? (
            <form onSubmit={saveProfile} className="space-y-3" noValidate>
              <FormField
                id="fullName"
                label={strings.auth.fullName}
                error={profileForm.formState.errors.fullName?.message}
              >
                <Input id="fullName" {...profileForm.register('fullName')} />
              </FormField>
              <div className="flex gap-2">
                <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                  {strings.common.save}
                </Button>
                <Button type="button" variant="outline" onClick={() => setProfileOpen(false)}>
                  {strings.common.cancel}
                </Button>
              </div>
            </form>
          ) : (
            <Button variant="outline" onClick={() => setProfileOpen(true)}>
              {strings.settings.editProfile}
            </Button>
          )}

          {passwordOpen ? (
            <form onSubmit={savePassword} className="space-y-3" noValidate>
              <FormField
                id="currentPassword"
                label={strings.settings.currentPassword}
                error={passwordForm.formState.errors.currentPassword?.message}
              >
                <PasswordInput
                  id="currentPassword"
                  autoComplete="current-password"
                  {...passwordForm.register('currentPassword')}
                />
              </FormField>
              <FormField
                id="newPassword"
                label={strings.settings.newPassword}
                error={passwordForm.formState.errors.newPassword?.message}
              >
                <PasswordInput
                  id="newPassword"
                  autoComplete="new-password"
                  {...passwordForm.register('newPassword')}
                />
              </FormField>
              <FormField
                id="confirmNewPassword"
                label={strings.auth.confirmPassword}
                error={passwordForm.formState.errors.confirmPassword?.message}
              >
                <PasswordInput
                  id="confirmNewPassword"
                  autoComplete="new-password"
                  {...passwordForm.register('confirmPassword')}
                />
              </FormField>
              <div className="flex gap-2">
                <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                  {strings.common.save}
                </Button>
                <Button type="button" variant="outline" onClick={() => setPasswordOpen(false)}>
                  {strings.common.cancel}
                </Button>
              </div>
            </form>
          ) : (
            <Button variant="outline" onClick={() => setPasswordOpen(true)}>
              {strings.settings.changePassword}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="space-y-3 p-5">
          <h2>{strings.settings.appearanceSection}</h2>
          <div className="flex flex-wrap gap-2">
            {THEME_OPTIONS.map(({ mode: option, label, icon: Icon }) => (
              <Button
                key={option}
                variant={mode === option ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode(option)}
              >
                <Icon className="size-4" />
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="space-y-3 p-5">
          <h2>{strings.settings.contactSection}</h2>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={CONTACT.whatsAppUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" />
                {strings.settings.contactWhatsApp}
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={`mailto:${CONTACT.email}`}>
                <Mail className="size-4" />
                {strings.settings.contactEmail}
              </a>
            </Button>
          </div>

          <h2 className="pt-2">{strings.settings.legalSection}</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link to={ROUTES.privacy} className="font-medium text-[var(--color-brand)]">
              {strings.settings.privacyPolicy}
            </Link>
            <Link to={ROUTES.terms} className="font-medium text-[var(--color-brand)]">
              {strings.settings.termsOfService}
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="flex flex-wrap gap-2 p-5">
          <Button variant="outline" onClick={() => setClearOpen(true)}>
            {strings.settings.clearHistory}
          </Button>
          <Button
            variant="outline"
            className="text-[var(--color-danger)]"
            onClick={() => setDeleteOpen(true)}
          >
            {strings.settings.deleteAccount}
          </Button>
          <Button variant="destructive" onClick={() => void logout()}>
            {strings.settings.logout}
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-[var(--color-text-muted)]">
        {strings.settings.version(APP_VERSION)}
      </p>

      <ConfirmDialog
        open={clearOpen}
        title={strings.settings.clearHistoryConfirmTitle}
        description={strings.settings.clearHistoryConfirmMessage}
        confirmLabel={strings.common.delete}
        destructive
        loading={clearHistory.isPending}
        onOpenChange={setClearOpen}
        onConfirm={() => {
          setClearOpen(false);
          void removeHistory();
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        title={strings.settings.deleteAccountConfirmTitle}
        description={strings.settings.deleteAccountConfirmMessage}
        confirmLabel={strings.settings.deleteAccount}
        destructive
        loading={deleting}
        onOpenChange={setDeleteOpen}
        onConfirm={() => {
          setDeleteOpen(false);
          void deleteAccount();
        }}
      />
    </div>
  );
}
