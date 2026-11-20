export function lastDayOfMonth(year: number, month: number): number {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) throw new RangeError('Invalid date');
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}
export function normalizeRecurringDay(day: number | null | undefined, isoDate: string): number {
  const n = Number(day ?? isoDate.slice(-2));
  return Number.isInteger(n) ? Math.max(1, Math.min(31, n)) : 1;
}
export function dueDateForMonth(yearMonth: string, day: number): string {
  const [year, month] = yearMonth.split('-').map(Number);
  return yearMonth + '-' + String(Math.min(lastDayOfMonth(year, month), Math.max(1, Math.trunc(day)))).padStart(2, '0');
}
export function isDueOnDate(day: number, isoDate: string): boolean {
  return dueDateForMonth(isoDate.slice(0, 7), day) === isoDate;
}
