import type { AllocationRates, HomeOfficeExpenses, MonthlyReimbursement, PaymentAllocation, PhoneInternetExpenses, RunwayInputs } from '@/types'

export const MONTHLY_FLOOR = 4250
export const DEFAULT_TAX_RATE = 0.30
export const DEFAULT_SEP_RATE = 0.15
export const DEFAULT_GIVING_RATE = 0.10
export const DEFAULT_GOALS_RATE = 0.10
export const DEFAULT_QUARTERLY_GOAL = 3000
export const DEFAULT_HOME_CONTRIBUTION = 3000
export const KNOWN_ORGS = [
  'Denver Animal Shelter',
  'Atlanta Humane Society',
  'Other',
] as const

// Runway calculations

export function calcDeployablePool(
  inputs: RunwayInputs,
  monthlyFloor: number
): number {
  const total = inputs.businessCashBalance + inputs.pipelineRemaining
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

// Allocation calculations

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

// Goals calculations

export function calcQuartersToGoal(
  targetAmount: number,
  currentAmount: number,
  quarterlyContribution: number
): number {
  if (quarterlyContribution <= 0) return Infinity
  const remaining = targetAmount - currentAmount
  if (remaining <= 0) return 0
  return Math.ceil(remaining / quarterlyContribution)
}

export function calcProgressPct(
  current: number,
  target: number
): number {
  if (target <= 0) return 0
  return Math.min(100, (current / target) * 100)
}

// Reimbursement calculations

export const MILEAGE_RATE_PER_MILE = 0.70  // 2026 IRS rate
export const PHONE_INTERNET_RATE = 0.70

export function calcOfficeRate(expenses: HomeOfficeExpenses): number {
  if (expenses.apartmentSqft <= 0) return 0
  return Math.min(1, expenses.officeSqft / expenses.apartmentSqft)
}

export function calcOfficeReimbursement(expenses: HomeOfficeExpenses): number {
  const rate = calcOfficeRate(expenses)
  const total = expenses.alarm + expenses.cleaning + expenses.rent + expenses.rentInsurance + expenses.utilities
  return total * rate
}

export function calcMileageReimbursement(miles: number): number {
  return miles * MILEAGE_RATE_PER_MILE
}

export function calcPhoneInternetReimbursement(expenses: PhoneInternetExpenses): number {
  return (expenses.internet + expenses.phone) * PHONE_INTERNET_RATE
}

export function calcTotalMonthlyReimbursement(month: MonthlyReimbursement): number {
  return (
    calcOfficeReimbursement(month.homeOffice) +
    calcOfficeReimbursement(month.recordingStudio) +
    calcMileageReimbursement(month.businessMiles) +
    calcPhoneInternetReimbursement(month.phoneInternet)
  )
}
