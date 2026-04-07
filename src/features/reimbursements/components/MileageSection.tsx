import { Card, Field, Input, Label, LineItem, Separator, Typography } from '@/ui'
import { calcMileageReimbursement, MILEAGE_RATE_PER_MILE } from '../utils/calculations'

interface MileageSectionProps {
  miles: number
  onChange: (miles: number) => void
}

export function MileageSection({ miles, onChange }: MileageSectionProps) {
  const reimbursement = calcMileageReimbursement(miles)

  return (
    <Card
      title="Mileage"
      headerExtra={
        <Typography variant="small" as="span">${MILEAGE_RATE_PER_MILE.toFixed(2)}/mile (2026 IRS)</Typography>
      }
    >
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4">
        <Field>
          <Label htmlFor="business-miles">Business miles driven</Label>
          <Input
            id="business-miles"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={miles || ''}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
          />
        </Field>
        <div className="text-right min-w-16">
          <Typography variant="small" className="mb-1">Reimburse</Typography>
          <Typography variant="label" numeric>${reimbursement.toFixed(2)}</Typography>
        </div>
      </div>
      <Separator />
      <LineItem label="Section total" value={`$${reimbursement.toFixed(2)}`} />
    </Card>
  )
}
