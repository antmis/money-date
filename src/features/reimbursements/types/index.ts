export interface OfficeTemplate {
  id: string
  name: string
  address: string
  officeSqft: number
  totalSqft: number
}

export interface OfficeMonthlyData {
  templateId: string
  name: string
  address: string
  officeSqft: number
  totalSqft: number
  alarm: number
  cleaning: number
  rent: number
  rentInsurance: number
  utilities: number
}

export interface HealthInsuranceTemplate {
  health: number
  dental: number
  vision: number
}

export interface HealthInsuranceExpenses {
  health: number
  dental: number
  vision: number
}

export interface PhoneInternetExpenses {
  internet: number
  phone: number
  internetUsage: number  // 0–100 percent of internet that is business use
  phoneUsage: number     // 0–100 percent of phone that is business use
}

export interface ComputedTotals {
  officesTotal: number
  milesTotal: number
  phoneTotal: number
  healthTotal: number
  total: number
}

export interface MonthlyReimbursement {
  year: number
  month: number // 1–12
  offices: OfficeMonthlyData[]
  businessMiles: number
  phoneInternet: PhoneInternetExpenses
  healthInsurance: HealthInsuranceExpenses
  paid: boolean
  paymentMethod: string
  paidDate: string
  computedTotals?: ComputedTotals
}
