import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { strings } from '@/shared/i18n/strings';
import { Sheet, SheetContent, SheetTitle } from '@/shared/ui/primitives/sheet';
import { ListSkeleton } from '@/shared/ui/states';

import { SidebarNav } from './SidebarNav';
import { TopBar } from './TopBar';

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      {/* Masaüstü: sabit sidebar (240px) */}
      <aside className="no-print fixed inset-y-0 left-0 hidden w-60 border-r border-[var(--color-border)] bg-[var(--color-surface)] lg:block">
        <SidebarNav />
      </aside>

      {/* Mobil/planşet: hamburger ilə açılan panel */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">{strings.common.openMenu}</SheetTitle>
          <SidebarNav onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-60">
        <TopBar onOpenMenu={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6">
          <Suspense fallback={<ListSkeleton rows={3} />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
