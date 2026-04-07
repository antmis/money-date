import type { Quarter } from '@/shared/types'

export interface JournalEntry {
  quarter: Quarter
  year: number
  completedAt?: string
  answers: {
    feeling: string
    alignment: string
    drift: string
    patterns: string
    avoidance: string
  }
}
