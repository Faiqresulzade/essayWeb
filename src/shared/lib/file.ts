import { OCR_MAX_FILE_BYTES } from '@/domain';

export type ImageValidationError = 'type' | 'size';

export function validateImage(file: File): ImageValidationError | null {
  if (!file.type.startsWith('image/')) return 'type';
  if (file.size > OCR_MAX_FILE_BYTES) return 'size';
  return null;
}

/** Yüklənən şəklin önizləməsi üçün obyekt URL-i yaradır (istifadədən sonra azad edilməlidir). */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
