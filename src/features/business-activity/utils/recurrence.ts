import type { BusinessActivity } from '../types'

export function todayISO(): string {
  return new Date().toLocaleDateString('en-CA')
}

/**
 * Computes the next occurrence date for a recurring entry, anchored to the
 * origin date's day-of-month (not "today"), clamped to the last valid day
 * of the target month (e.g. Jan 30 monthly -> Feb 28/29).
 */
export function computeNextOccurrenceDate(date: string, frequency: 'monthly' | 'annually'): string {
  const [year, month, day] = date.split('-').map(Number)

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
  const newDay = Math.min(day, lastDayOfNewMonth)

  const mm = String(newMonth).padStart(2, '0')
  const dd = String(newDay).padStart(2, '0')
  return `${newYear}-${mm}-${dd}`
}

export function findLatestInSeries(entries: BusinessActivity[], seriesId: string): BusinessActivity | null {
  const inSeries = entries.filter(e => e.seriesId === seriesId)
  if (inSeries.length === 0) return null
  return inSeries.reduce((latest, e) => (e.date > latest.date ? e : latest))
}

export function isSeriesActive(entries: BusinessActivity[], seriesId: string): boolean {
  const latest = findLatestInSeries(entries, seriesId)
  return !!latest && latest.repeatFrequency !== 'none'
}
