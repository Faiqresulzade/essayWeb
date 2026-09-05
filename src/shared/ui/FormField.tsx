import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import { Label } from './primitives/label';

interface FormFieldProps {
  readonly id: string;
  readonly label: string;
  readonly error?: string;
  readonly hint?: string;
  readonly className?: string;
  readonly children: ReactNode;
}

/** Sahə + etiket + xəta mətni: xəta yalnız rənglə deyil, mətnlə də bildirilir (§18). */
export function FormField({ id, label, error, hint, className, children }: FormFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id}>{label}</Label>
      <div aria-describedby={describedBy}>{children}</div>
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-[var(--color-text-muted)]">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </div>
  );
}
