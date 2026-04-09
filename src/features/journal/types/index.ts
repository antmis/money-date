import type { Quarter } from '@/shared/types'

export interface JournalEntry {
  quarter: Quarter
  year: number
  completedAt?: string
}
