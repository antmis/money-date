import { Card, ListItem, Typography } from '@/ui'
import type { PhoneInternetExpenses } from '../types'
import { calcPhoneInternetReimbursement, PHONE_INTERNET_RATE } from '../utils/calculations'
import { ReimbursementField } from './ReimbursementField'

interface PhoneInternetSectionProps {
  expenses: PhoneInternetExpenses
  onChange: (field: keyof PhoneInternetExpenses, value: number) => void
}

export function PhoneInternetSection({ expenses, onChange }: PhoneInternetSectionProps) {
  const total = calcPhoneInternetReimbursement(expenses)

  return (
    <Card
      title="Phone & Internet"
      headerExtra={
        <Typography variant="small" as="span">{(PHONE_INTERNET_RATE * 100).toFixed(0)}% business usage</Typography>
      }
      footer={<ListItem title="Phone & Internet Total" lineItem={`$${total.toFixed(2)}`} />}
    >
      <ReimbursementField
        id="internet-cost"
        label="Internet (full cost)"
        value={expenses.internet}
        reimbursement={expenses.internet * PHONE_INTERNET_RATE}
        prefix="$"
        onChange={(v) => onChange('internet', v)}
      />
      <ReimbursementField
        id="phone-cost"
        label="Phone (full cost)"
        value={expenses.phone}
        reimbursement={expenses.phone * PHONE_INTERNET_RATE}
        prefix="$"
        onChange={(v) => onChange('phone', v)}
      />
    </Card>
  )
}
