import { LogOut, Menu, Moon, Settings as SettingsIcon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useLogout } from '@/features/auth/api/useLogout';
import { useAuthStore } from '@/features/auth/model/authContext';
import { ROUTES } from '@/shared/config/routes';
import { strings } from '@/shared/i18n/strings';
import { initials } from '@/shared/lib/format';
import { resolvedTheme, useThemeStore } from '@/shared/theme/themeStore';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { Avatar, AvatarFallback } from '@/shared/ui/primitives/avatar';
import { Button } from '@/shared/ui/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu';

import { navTitleFor } from './navItems';

interface TopBarProps {
  readonly onOpenMenu: () => void;
}

export function TopBar({ onOpenMenu }: TopBarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { mode, setMode } = useThemeStore();
  const { logout, isPending } = useLogout();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isDark = resolvedTheme(mode) === 'dark';

  return (
    <header className="no-print sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 px-4 backdrop-blur">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMenu}
        aria-label={strings.common.openMenu}
      >
        <Menu className="size-5" />
      </Button>

      <h2 className="flex-1 truncate text-base font-bold">{navTitleFor(pathname)}</h2>

      <Button
        variant="ghost"
        size="icon"
        aria-label={strings.common.toggleTheme}
        onClick={() => setMode(isDark ? 'light' : 'dark')}
      >
        {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={strings.settings.profileSection}>
            <Avatar className="size-8">
              <AvatarFallback className="bg-[var(--color-brand)]/10 text-xs font-semibold text-[var(--color-brand)]">
                {initials(user?.fullName ?? '')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="truncate">
            {user?.fullName}
            <span className="block text-xs font-normal text-[var(--color-text-muted)]">
              {user?.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => void navigate(ROUTES.settings)}>
            <SettingsIcon className="size-4" />
            {strings.nav.settings}
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => setConfirmOpen(true)}>
            <LogOut className="size-4" />
            {strings.settings.logout}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOpen}
        title={strings.settings.logoutConfirmTitle}
        description={strings.settings.logoutConfirmMessage}
        confirmLabel={strings.settings.logout}
        destructive
        loading={isPending}
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          void logout();
          setConfirmOpen(false);
        }}
      />
    </header>
  );
}
