export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4'
export type TruckMode = 'payoff' | 'mods'

export interface RunwayInputs {
  businessCashBalance: number
  pipelineRemaining: number
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

export interface TruckGoal {
  currentMode: TruckMode
  payoffBalance: number
  modFundBalance: number
  quarterlyAmount: number
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

export interface HomeOfficeExpenses {
  address: string
  officeSqft: number
  apartmentSqft: number
  alarm: number
  cleaning: number
  rent: number
  rentInsurance: number
  utilities: number
}

export interface PhoneInternetExpenses {
  internet: number
  phone: number
}

export interface MonthlyReimbursement {
  year: number
  month: number // 1–12
  homeOffice: HomeOfficeExpenses
  recordingStudio: HomeOfficeExpenses
  businessMiles: number
  phoneInternet: PhoneInternetExpenses
  paid: boolean
  paymentMethod: string
  paidDate: string
}
