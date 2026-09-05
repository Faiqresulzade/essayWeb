import dayjs from 'dayjs';
import 'dayjs/locale/az';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('az');

/** Backend tarixləri UTC ISO-dur; brauzer onları avtomatik yerli vaxta çevirir. */
export function formatDate(iso: string): string {
  return dayjs(iso).format('D MMMM YYYY');
}

export function formatDateTime(iso: string): string {
  return dayjs(iso).format('D MMMM YYYY, HH:mm');
}

export function formatShortDate(iso: string): string {
  return dayjs(iso).format('D MMM');
}

export function formatDayMonth(iso: string): string {
  return dayjs(iso).format('DD.MM.YYYY');
}

/** Saniyəni `04:12:33` formatına çevirir (geri sayım üçün). */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return [hours, minutes, seconds].map(part => String(part).padStart(2, '0')).join(':');
}

export function secondsUntil(iso: string, now: number = Date.now()): number {
  return Math.max(0, Math.floor((new Date(iso).getTime() - now) / 1000));
}

export function minutesUntil(iso: string, now: number = Date.now()): number {
  return Math.ceil(secondsUntil(iso, now) / 60);
}

export function isPast(iso: string, now: number = Date.now()): boolean {
  return new Date(iso).getTime() <= now;
}
