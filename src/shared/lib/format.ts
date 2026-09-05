/** Bal həmişə bir onluq rəqəmlə göstərilir: `3.7`. */
export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined || Number.isNaN(score)) return '—';
  return score.toFixed(1);
}

export function formatPercent(percent: number | null | undefined, fractionDigits = 0): string {
  if (percent === null || percent === undefined || Number.isNaN(percent)) return '—';
  return `${percent.toFixed(fractionDigits)}%`;
}

export function formatDecimal(value: number | null | undefined, fractionDigits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return value.toFixed(fractionDigits);
}

export function formatPrice(price: number, currency: string): string {
  const symbol = currency === 'USD' ? '$' : `${currency} `;
  return `${symbol}${price.toFixed(2)}`;
}

/** Avatar üçün ad-soyadın baş hərfləri. */
export function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/u).filter(Boolean);
  const first = parts[0]?.charAt(0) ?? '';
  const second = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + second).toLocaleUpperCase('az-AZ');
}

export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}…`;
}
