import { Card, Field, Input, Label, Separator, Typography } from '@/components/ui'
import type { HomeOfficeExpenses } from '@/types'
import { calcOfficeRate, calcOfficeReimbursement } from '@/lib/calculations'

interface ExpenseRowProps {
  label: string
  id: string
  value: number
  rate: number
  onChange: (value: number) => void
}

function ExpenseRow({ label, id, value, rate, onChange }: ExpenseRowProps) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4">
      <Field>
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          prefix="$"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
      </Field>
      <div className="text-right min-w-16">
        <Typography variant="small" className="mb-1">Reimburse</Typography>
        <Typography variant="label" numeric>${(value * rate).toFixed(2)}</Typography>
      </div>
    </div>
  )
}

interface HomeOfficeSectionProps {
  title: string
  expenses: HomeOfficeExpenses
  onChange: (field: keyof HomeOfficeExpenses, value: number | string) => void
}

export function HomeOfficeSection({ title, expenses, onChange }: HomeOfficeSectionProps) {
  const rate = calcOfficeRate(expenses)
  const total = calcOfficeReimbursement(expenses)
  const ratePct = (rate * 100).toFixed(1)

  return (
    <Card
      title={title}
      headerExtra={
        <Typography variant="small" as="span">
          {expenses.officeSqft > 0 && expenses.apartmentSqft > 0
            ? `${ratePct}% reimbursement`
            : 'enter sq ft to calculate rate'}
        </Typography>
      }
    >
      <Field>
        <Label htmlFor={`${title}-address`}>Address</Label>
        <Input
          id={`${title}-address`}
          placeholder="123 Main St, Denver, CO 80218"
          value={expenses.address}
          onChange={(e) => onChange('address', e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label htmlFor={`${title}-officeSqft`}>Office sq ft</Label>
          <Input
            id={`${title}-officeSqft`}
            type="number"
            min="0"
            step="1"
            placeholder="125"
            value={expenses.officeSqft || ''}
            onChange={(e) => onChange('officeSqft', Number(e.target.value) || 0)}
          />
        </Field>
        <Field>
          <Label htmlFor={`${title}-apartmentSqft`}>Apartment sq ft</Label>
          <Input
            id={`${title}-apartmentSqft`}
            type="number"
            min="0"
            step="1"
            placeholder="625"
            value={expenses.apartmentSqft || ''}
            onChange={(e) => onChange('apartmentSqft', Number(e.target.value) || 0)}
          />
        </Field>
      </div>

      <Separator />

      <ExpenseRow label="Alarm & Security" id={`${title}-alarm`} value={expenses.alarm} rate={rate} onChange={(v) => onChange('alarm', v)} />
      <ExpenseRow label="Cleaning" id={`${title}-cleaning`} value={expenses.cleaning} rate={rate} onChange={(v) => onChange('cleaning', v)} />
      <ExpenseRow label="Rent" id={`${title}-rent`} value={expenses.rent} rate={rate} onChange={(v) => onChange('rent', v)} />
      <ExpenseRow label="Rent Insurance" id={`${title}-rentInsurance`} value={expenses.rentInsurance} rate={rate} onChange={(v) => onChange('rentInsurance', v)} />
      <ExpenseRow label="Utilities" id={`${title}-utilities`} value={expenses.utilities} rate={rate} onChange={(v) => onChange('utilities', v)} />

      <Separator />
      <div className="flex justify-between items-center">
        <Typography variant="muted" as="span">Section total</Typography>
        <Typography variant="amount" as="span">${total.toFixed(2)}</Typography>
      </div>
    </Card>
  )
}
