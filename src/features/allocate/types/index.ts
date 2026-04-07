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
