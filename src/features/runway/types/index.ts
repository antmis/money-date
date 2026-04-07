import type { Quarter } from '@/shared/types'

export interface RunwayInputs {
  businessCashBalance: number
  quartersRemaining: number
  bufferMonths: 3 | 6
}

export interface QuarterInputs {
  quarter: Quarter
  year: number
  incomeReceived: number
  businessCashStartOfQ: number
}
