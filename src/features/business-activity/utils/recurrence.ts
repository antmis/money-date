import type { BusinessActivity } from '../types'

export function todayISO(): string {
  return new Date().toLocaleDateString('en-CA')
}

/**
 * Computes the next occurrence date for a recurring entry, clamped to the
 * last valid day of the target month (e.g. day 30 in Feb -> 28/29).
 *
 * `anchorDay` must be the series' original day-of-month (from its earliest
 * entry), not the previous occurrence's day — otherwise a clamp in a short
 * month (Jan 31 -> Feb 28) would permanently "stick" at 28 for every later
 * month instead of returning to 31/30 once the month is long enough again.
 */
export function computeNextOccurrenceDate(date: string, frequency: 'monthly' | 'annually', anchorDay: number): string {
  const [year, month] = date.split('-').map(Number)

  let newYear = year
  let newMonth = month
  if (frequency === 'monthly') {
    newMonth = month + 1
    if (newMonth > 12) {
      newMonth = 1
      newYear += 1
    }
  } else {
    newYear = year + 1
  }

  const lastDayOfNewMonth = new Date(newYear, newMonth, 0).getDate()
  const newDay = Math.min(anchorDay, lastDayOfNewMonth)

  const mm = String(newMonth).padStart(2, '0')
  const dd = String(newDay).padStart(2, '0')
  return `${newYear}-${mm}-${dd}`
}

export function findLatestInSeries(entries: BusinessActivity[], seriesId: string): BusinessActivity | null {
  const inSeries = entries.filter(e => e.seriesId === seriesId)
  if (inSeries.length === 0) return null
  return inSeries.reduce((latest, e) => (e.date > latest.date ? e : latest))
}

export function getSeriesAnchorDay(entries: BusinessActivity[], seriesId: string): number {
  const inSeries = entries.filter(e => e.seriesId === seriesId)
  const earliest = inSeries.reduce((min, e) => (e.date < min.date ? e : min))
  return Number(earliest.date.split('-')[2])
}

export function isSeriesActive(entries: BusinessActivity[], seriesId: string): boolean {
  const latest = findLatestInSeries(entries, seriesId)
  return !!latest && latest.repeatFrequency !== 'none'
}
