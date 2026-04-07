import { Card, Field, Input, Label, LineItem, Separator, Typography } from '@/ui'
import type { PhoneInternetExpenses } from '../types'
import { calcPhoneInternetReimbursement, PHONE_INTERNET_RATE } from '../utils/calculations'

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
    >
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4">
        <Field>
          <Label htmlFor="internet-cost">Internet (full cost)</Label>
          <Input
            id="internet-cost"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            prefix="$"
            value={expenses.internet || ''}
            onChange={(e) => onChange('internet', Number(e.target.value) || 0)}
          />
        </Field>
        <div className="text-right min-w-16">
          <Typography variant="small" className="mb-1">Reimburse</Typography>
          <Typography variant="label" numeric>
            ${(expenses.internet * PHONE_INTERNET_RATE).toFixed(2)}
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4">
        <Field>
          <Label htmlFor="phone-cost">Phone (full cost)</Label>
          <Input
            id="phone-cost"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            prefix="$"
            value={expenses.phone || ''}
            onChange={(e) => onChange('phone', Number(e.target.value) || 0)}
          />
        </Field>
        <div className="text-right min-w-16">
          <Typography variant="small" className="mb-1">Reimburse</Typography>
          <Typography variant="label" numeric>
            ${(expenses.phone * PHONE_INTERNET_RATE).toFixed(2)}
          </Typography>
        </div>
      </div>

      <Separator />
      <LineItem label="Section total" value={`$${total.toFixed(2)}`} />
    </Card>
  )
}
