export const PASSWORD_MIN_LENGTH = 8;

export type PasswordRequirement = 'length' | 'uppercase' | 'lowercase' | 'digit';

const CHECKS: Readonly<Record<PasswordRequirement, (value: string) => boolean>> = {
  length: value => value.length >= PASSWORD_MIN_LENGTH,
  uppercase: value => /[A-ZÜÖĞŞÇİI]/.test(value),
  lowercase: value => /[a-züöğşçıi]/.test(value),
  digit: value => /\d/.test(value),
};

export function unmetPasswordRequirements(value: string): PasswordRequirement[] {
  return (Object.keys(CHECKS) as PasswordRequirement[]).filter(key => !CHECKS[key](value));
}

export function isStrongPassword(value: string): boolean {
  return unmetPasswordRequirements(value).length === 0;
}
