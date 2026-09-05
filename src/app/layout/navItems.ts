import {
  BarChart3,
  BookOpen,
  Clock,
  CreditCard,
  PenLine,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { ROUTES } from '@/shared/config/routes';
import { strings } from '@/shared/i18n/strings';

export interface NavItem {
  readonly label: string;
  readonly to: string;
  readonly icon: LucideIcon;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: strings.nav.essay, to: ROUTES.essay, icon: PenLine },
  { label: strings.nav.history, to: ROUTES.history, icon: Clock },
  { label: strings.nav.lessons, to: ROUTES.lessons, icon: BookOpen },
  { label: strings.nav.students, to: ROUTES.students, icon: Users },
  { label: strings.nav.reports, to: ROUTES.reports, icon: BarChart3 },
  { label: strings.nav.plans, to: ROUTES.plans, icon: CreditCard },
  { label: strings.nav.settings, to: ROUTES.settings, icon: Settings },
];

/** Cari yola uyğun səhifə başlığı (TopBar üçün). */
export function navTitleFor(pathname: string): string {
  const match = NAV_ITEMS.filter(item => pathname.startsWith(item.to)).sort(
    (a, b) => b.to.length - a.to.length,
  )[0];
  return match?.label ?? strings.common.appName;
}
