import { useEffect, useState } from 'react';

import { secondsUntil } from '@/shared/lib/date';

/** Verilmiş ISO tarixinə qədər qalan saniyələr; hər saniyə yenilənir. */
export function useCountdown(targetIso: string | null | undefined): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetIso) return;

    const timer = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (secondsUntil(targetIso, current) <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetIso]);

  // Qalan vaxt render zamanı hesablanır — vəziyyət yalnız "indi"ni saxlayır.
  return targetIso ? secondsUntil(targetIso, now) : 0;
}
