import { NavLink } from 'react-router-dom';

import { strings } from '@/shared/i18n/strings';
import { cn } from '@/shared/lib/cn';

import { NAV_ITEMS } from './navItems';
import { UsageWidget } from './UsageWidget';

interface SidebarNavProps {
  readonly onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex items-center gap-2 px-2">
        <span className="flex size-8 items-center justify-center rounded-chip bg-gradient-brand text-sm font-bold text-white">
          EC
        </span>
        <span className="font-bold">{strings.common.appName}</span>
      </div>

      <nav className="flex-1" aria-label={strings.common.openMenu}>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-button px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-text)]',
                  )
                }
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <UsageWidget />
    </div>
  );
}
