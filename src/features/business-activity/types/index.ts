export type BusinessActivityType = 'business_expense' | 'business_income'

export const XERO_ACCOUNTS = [
  'Advertising & Marketing',
  'Bank Fees & Charges',
  'Education & Training',
  'Entertainment',
  'Legal & Professional Services',
  'Meals & Entertainment',
  'Office Expenses',
  'Software & Subscriptions',
  'Travel & Accommodation',
  'Other',
] as const

export type XeroAccount = (typeof XERO_ACCOUNTS)[number]

export interface BusinessActivity {
  id: string
  date: string              // ISO date YYYY-MM-DD
  type: BusinessActivityType
  customerVendorName: string
  account: string
  amount: number
  reimbursementDate: string // ISO date YYYY-MM-DD, may be empty
  paymentMethod: string
  businessPurpose: string
}
