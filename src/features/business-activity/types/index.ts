export type BusinessActivityType = 'business_expense' | 'business_income'

export const XERO_ACCOUNT_GROUPS = [
  {
    label: 'Expenses',
    options: [
      { value: '5000', label: '5000 - Cost of Goods Sold' },
      { value: '5100', label: '5100 - Purchase Discount' },
      { value: '5300', label: '5300 - Subcontractors' },
      { value: '6000', label: '6000 - Advertising' },
      { value: '6040', label: '6040 - Bank Service Charges' },
      { value: '6110', label: '6110 - Automobile Expense' },
      { value: '6145', label: '6145 - Office Expense' },
      { value: '6155', label: '6155 - Dues & Subscriptions' },
      { value: '6200', label: '6200 - Meals & Entertainment' },
      { value: '6320', label: '6320 - Insurance' },
      { value: '6330', label: '6330 - Professional Fees' },
      { value: '6350', label: '6350 - Education & Training' },
      { value: '6400', label: '6400 - Reimbursable Expense' },
      { value: '6680', label: '6680 - Wages & Salaries' },
      { value: '6720', label: '6720 - Payroll Tax Expense' },
      { value: '6722', label: '6722 - Mileage Reimbursement' },
      { value: '6900', label: '6900 - Bad Debt' },
      { value: '7000', label: '7000 - Depreciation' },
      { value: '7050', label: '7050 - Miscellaneous' },
      { value: '7150', label: '7150 - Other Expense' },
    ],
  },
  {
    label: 'Assets',
    options: [
      { value: '1300', label: '1300 - Prepayments' },
      { value: '1320', label: '1320 - Employee Advances' },
      { value: '1350', label: '1350 - Vendor Deposits' },
      { value: '1520', label: '1520 - Computer & Office Equipment' },
      { value: '1521', label: '1521 - Less-Accumulated Depreciation: Computer & Office Equipment' },
      { value: '1530', label: '1530 - Vehicles' },
      { value: '1531', label: '1531 - Less-Accumulated Depreciation: Vehicles' },
    ],
  },
  {
    label: 'Liabilities',
    options: [
      { value: '2060', label: '2060 - Gift Card Liability' },
      { value: '2160', label: '2160 - Payroll Wages Payable' },
      { value: '2170', label: '2170 - Federal Payroll Liability' },
      { value: '2180', label: '2180 - Other Payroll Liability' },
      { value: '2190', label: '2190 - State Payroll Liability' },
      { value: '2200', label: '2200 - Sales Tax' },
      { value: '2400', label: '2400 - Line of Credit' },
      { value: '2500', label: '2500 - Suspense' },
      { value: '2550', label: '2550 - Historical Adjustment' },
      { value: '2600', label: '2600 - Rounding' },
    ],
  },
  {
    label: 'Equity',
    options: [
      { value: '3000', label: '3000 - Owner\'s Capital' },
      { value: '3110', label: '3110 - Owner\'s Capital: Owner\'s Investment' },
      { value: '3120', label: '3120 - Owner\'s Capital: Owner\'s Draw' },
      { value: '3130', label: '3130 - Owner\'s Capital: Owner\'s Billable Time' },
      { value: '3900', label: '3900 - Retained Earnings' },
    ],
  },
  {
    label: 'Revenue',
    options: [
      { value: '4000', label: '4000 - Sales' },
      { value: '4100', label: '4100 - Discount Received' },
      { value: '4200', label: '4200 - Merchandise' },
      { value: '4300', label: '4300 - Service' },
      { value: '4400', label: '4400 - Markup on Reimbursable Expenses' },
      { value: '4710', label: '4710 - Uncategorized Income' },
      { value: '4715', label: '4715 - Other Income' },
      { value: '4820', label: '4820 - Vendor Refunds' },
    ],
  }
] as const

export interface BusinessActivity {
  id: string
  date: string
  type: BusinessActivityType
  customerVendorName: string
  account: string // This will store the 4-digit code string
  amount: number
  reimbursementDate: string
  paymentMethod: string
  businessPurpose: string
}
