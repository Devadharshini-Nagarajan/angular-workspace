export function toYearMonth(date?: Date | string): string {
  const dateObj =
    date instanceof Date ? date : date ? new Date(date) : new Date();
  const year = String(dateObj.getFullYear());
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
