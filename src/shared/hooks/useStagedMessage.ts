import { useEffect, useState } from 'react';

/**
 * Uzun sürən AI sorğuları zamanı mərhələli mətnlər göstərir
 * (sadə spinner əvəzinə istifadəçiyə nə baş verdiyini izah edir).
 */
export function useStagedMessage(
  stages: readonly string[],
  intervalMs: number,
  active: boolean,
): string {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;

    let step = 0;
    const lastIndex = stages.length - 1;
    const timer = setInterval(() => {
      step = Math.min(step + 1, lastIndex);
      setIndex(step);
    }, intervalMs);

    return () => {
      clearInterval(timer);
      setIndex(0);
    };
  }, [active, intervalMs, stages.length]);

  return stages[index] ?? stages[0] ?? '';
}
