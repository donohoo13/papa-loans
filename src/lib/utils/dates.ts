import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export function formatDate(date: Dayjs, format: string = "MMMM D, YYYY"): string {
  return date.format(format);
}

export function isValidDate(date: Dayjs): boolean {
  return date.isValid();
}

export function compareDates(a: Dayjs, b: Dayjs): number {
  return a.valueOf() - b.valueOf();
}

export function calculateDaysBetween(start: Dayjs, end: Dayjs): number {
  return end.diff(start, 'day');
}