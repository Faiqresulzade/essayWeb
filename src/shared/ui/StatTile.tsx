import { cn } from '@/shared/lib/cn';

interface StatTileProps {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  readonly valueColor?: string;
  readonly className?: string;
}

/** Kiçik rəqəm kartı: etiket → dəyər → köməkçi mətn. */
export function StatTile({ label, value, hint, valueColor, className }: StatTileProps) {
  return (
    <div
      className={cn(
        'rounded-card border border-[var(--color-border)] bg-[var(--color-surface)] p-4',
        className,
      )}
    >
      <p className="text-[11px] text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-xl font-bold" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </p>
      {hint && <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">{hint}</p>}
    </div>
  );
}
