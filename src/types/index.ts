export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4'

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

export interface AllocationRates {
  taxReserve: number   // default 30 (as percentage)
  sepIra: number       // default 15
  giving: number       // default 10
  // goals is now a fixed $ amount from Goals tab, not a %
}

export interface PaymentAllocation {
  paymentAmount: number
  taxReserve: number
  sepIra: number
  giving: number
  goals: number
  discretionary: number
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  quarterlyContribution: number
}


export interface Donation {
  id: string
  date: string
  organization: string
  amount: number
  receiptFile?: File
  receiptName?: string
}

export interface GivingState {
  donations: Donation[]
  allocationPct: number
}

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

// Reimbursements

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
}
