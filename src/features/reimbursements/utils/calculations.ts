import type { HealthInsuranceExpenses, MonthlyReimbursement, OfficeMonthlyData, PhoneInternetExpenses } from '../types'

export const MILEAGE_RATE_PER_MILE = 0.725  // 2026 IRS rate

export function calcOfficeRate(office: OfficeMonthlyData): number {
  if (office.totalSqft <= 0) return 0
  return Math.min(1, office.officeSqft / office.totalSqft)
}

export function calcOfficeReimbursement(office: OfficeMonthlyData): number {
  const rate = calcOfficeRate(office)
  const total = office.alarm + office.cleaning + office.rent + office.rentInsurance + office.utilities
  return total * rate
}

export function calcMileageReimbursement(miles: number): number {
  return miles * MILEAGE_RATE_PER_MILE
}

export function calcPhoneInternetReimbursement(expenses: PhoneInternetExpenses): number {
  return (expenses.internet * (expenses.internetUsage / 100))
       + (expenses.phone    * (expenses.phoneUsage    / 100))
}

export function calcHealthInsuranceReimbursement(health: HealthInsuranceExpenses): number {
  return health.health + health.dental + health.vision
}

export function calcTotalMonthlyReimbursement(month: MonthlyReimbursement): number {
  const officesTotal = month.offices.reduce((sum, o) => sum + calcOfficeReimbursement(o), 0)
  return (
    officesTotal +
    calcMileageReimbursement(month.businessMiles) +
    calcPhoneInternetReimbursement(month.phoneInternet) +
    calcHealthInsuranceReimbursement(month.healthInsurance)
  )
}
