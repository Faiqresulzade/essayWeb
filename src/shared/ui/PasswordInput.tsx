import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';

import { strings } from '@/shared/i18n/strings';
import { cn } from '@/shared/lib/cn';

import { Input } from './primitives/input';

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'>;

/** Şifrə sahəsi — göz ikonu ilə mətni görünən/gizli edir. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={cn('pr-10', className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible(current => !current)}
          aria-label={visible ? strings.auth.hidePassword : strings.auth.showPassword}
          aria-pressed={visible}
          tabIndex={-1}
          className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
