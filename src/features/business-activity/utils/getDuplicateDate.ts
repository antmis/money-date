/**
 * Computes the date for a duplicated business activity entry: the month after
 * the original entry's month, on today's day-of-month (clamped to the last
 * valid day of that month if it doesn't exist, e.g. Feb 30 -> Feb 28).
 */
export function getDuplicateDate(originalDate: string, today: Date = new Date()): string {
  const [origYear, origMonth] = originalDate.split('-').map(Number)

  let newMonth = origMonth + 1
  let newYear = origYear
  if (newMonth > 12) {
    newMonth = 1
    newYear += 1
  }

  const lastDayOfNewMonth = new Date(newYear, newMonth, 0).getDate()
  const day = Math.min(today.getDate(), lastDayOfNewMonth)

  const mm = String(newMonth).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${newYear}-${mm}-${dd}`
}
