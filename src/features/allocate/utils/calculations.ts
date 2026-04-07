import type { AllocationRates, PaymentAllocation } from '../types'

export const DEFAULT_TAX_RATE = 0.30
export const DEFAULT_SEP_RATE = 0.15
export const DEFAULT_GIVING_RATE = 0.10
export const DEFAULT_GOALS_RATE = 0.10

export function calcPaymentAllocation(
  paymentAmount: number,
  rates: AllocationRates,
  goalsAmount: number
): PaymentAllocation {
  const taxReserve = paymentAmount * (rates.taxReserve / 100)
  const sepIra = paymentAmount * (rates.sepIra / 100)
  const giving = paymentAmount * (rates.giving / 100)
  const goals = Math.min(goalsAmount, Math.max(0, paymentAmount - taxReserve - sepIra - giving))
  const discretionary = Math.max(0, paymentAmount - taxReserve - sepIra - giving - goals)

  return {
    paymentAmount,
    taxReserve,
    sepIra,
    giving,
    goals,
    discretionary,
  }
}
