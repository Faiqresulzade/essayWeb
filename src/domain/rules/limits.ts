/** Backend-in qəbul etdiyi ölçü/uzunluq limitləri — validasiya üçün tək mənbə. */

export const ESSAY_TEXT_MAX_CHARS = 5000;
export const ESSAY_TOPIC_MAX_CHARS = 300;
export const ESSAY_TITLE_MAX_CHARS = 60;
export const LESSON_TOPIC_MAX_CHARS = 200;
export const FULL_NAME_MAX_CHARS = 100;
export const GROUP_NAME_MAX_CHARS = 100;

export const OCR_MAX_FILE_BYTES = 10 * 1024 * 1024;
export const GRADE9_MAX_REQUEST_BYTES = 15 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
] as const;

/** Bir esse üçün maksimum neçə şəkil səhifəsi OCR-dan keçirilə bilər. */
export const OCR_MAX_PAGES = 2;

export const MAX_GROUPS_PER_TEACHER = 50;
export const MAX_STUDENTS_PER_GROUP = 200;

export const DEFAULT_PAGE_SIZE = 20;
