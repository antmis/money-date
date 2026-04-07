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
