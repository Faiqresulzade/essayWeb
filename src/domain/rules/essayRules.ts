import type { EssayGrade } from '../models/enums';

/**
 * Grade9 DİM formatı fərqlidir: həmişə multipart endpoint-ə gedir (şəkilsiz olsa belə).
 * Adi `/evaluate` endpoint-i `Grade9` üçün 400 qaytarır.
 */
export function requiresGrade9Endpoint(grade: EssayGrade | null): boolean {
  return grade === 'Grade9';
}

/** Tapşırıq mövzusu yalnız Grade11 üçün nəzərə alınır. */
export function supportsTopic(grade: EssayGrade | null): boolean {
  return grade === 'Grade11';
}

/** Şagird seçilibsə və kartında sinif varsa, sinif seçimi istifadəçidən soruşulmur. */
export function resolveGrade(
  selectedGrade: EssayGrade | null,
  studentGrade: EssayGrade | null | undefined,
): EssayGrade | null {
  return studentGrade ?? selectedGrade;
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/u).length;
}
