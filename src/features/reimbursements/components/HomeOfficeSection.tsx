import { Pencil, Trash2 } from 'lucide-react'
import { Card, Button, Field, Input, Label, LineItem, Separator, Typography } from '@/ui'
import type { OfficeMonthlyData } from '../types'
import { calcOfficeRate, calcOfficeReimbursement } from '../utils/calculations'

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

interface OfficeLocationSectionProps {
  office: OfficeMonthlyData
  onChange: (field: keyof OfficeMonthlyData, value: number | string) => void
  onEdit?: () => void
  onDelete?: () => void
}

export function OfficeLocationSection({ office, onChange, onEdit, onDelete }: OfficeLocationSectionProps) {
  const rate = calcOfficeRate(office)
  const total = calcOfficeReimbursement(office)
  const ratePct = (rate * 100).toFixed(1)
  const slug = office.templateId
  const hasLocation = office.address || office.officeSqft > 0 || office.totalSqft > 0

  const titleNode = hasLocation ? (
    <div>
      <div className="text-base font-semibold">{office.name}</div>
      {office.address && (
        <div className="text-xs font-normal text-muted-foreground mt-0.5">{office.address}</div>
      )}
    </div>
  ) : (
    office.name
  )

  const headerExtraNode = (
    <div className="flex items-start gap-2">
      {hasLocation && (
        <div className="text-right">
          <div className="text-sm text-muted-foreground">{ratePct}% reimbursement</div>
          {(office.officeSqft > 0 || office.totalSqft > 0) && (
            <div className="text-xs text-muted-foreground mt-0.5">
              {office.officeSqft} / {office.totalSqft} sq ft
            </div>
          )}
        </div>
      )}
      <div className="flex gap-1">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit} className="h-7 w-7 p-0">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete} className="h-7 w-7 p-0">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <Card title={titleNode} headerExtra={headerExtraNode}>
      <ExpenseRow label="Rent" id={`${slug}-rent`} value={office.rent} rate={rate} onChange={(v) => onChange('rent', v)} />
      <ExpenseRow label="Utilities" id={`${slug}-utilities`} value={office.utilities} rate={rate} onChange={(v) => onChange('utilities', v)} />
      <ExpenseRow label="Rent Insurance" id={`${slug}-rentInsurance`} value={office.rentInsurance} rate={rate} onChange={(v) => onChange('rentInsurance', v)} />
      <ExpenseRow label="Alarm & Security" id={`${slug}-alarm`} value={office.alarm} rate={rate} onChange={(v) => onChange('alarm', v)} />
      <ExpenseRow label="Cleaning" id={`${slug}-cleaning`} value={office.cleaning} rate={rate} onChange={(v) => onChange('cleaning', v)} />
      <Separator />
      <LineItem label="Section total" value={`$${total.toFixed(2)}`} />
    </Card>
  )
}
