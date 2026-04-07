import type { RunwayInputs } from '../types'

export function calcDeployablePool(
  inputs: RunwayInputs,
  monthlyFloor: number
): number {
  const total = inputs.businessCashBalance
  const buffer = monthlyFloor * 3 * inputs.quartersRemaining
  return Math.max(0, total - buffer)
}

export function calcRunwayMonths(
  totalAvailable: number,
  monthlyFloor: number
): number {
  if (monthlyFloor <= 0) return 0
  return totalAvailable / monthlyFloor
}

export function calcSafePerQuarter(
  deployable: number,
  quartersRemaining: number
): number {
  if (quartersRemaining <= 0) return deployable
  return deployable / quartersRemaining
}

export function calcRunwayStatus(
  months: number
): 'healthy' | 'lean' | 'critical' {
  if (months >= 6) return 'healthy'
  if (months >= 3) return 'lean'
  return 'critical'
}

export function calcBuffer(
  monthlyFloor: number,
  months: 3 | 6
): number {
  return monthlyFloor * months
}
