import { Card, Field, Grid, Input, Label, LineItem, Separator, Typography } from '@/components/ui'
import type { HealthInsuranceExpenses } from '@/types'
import { calcHealthInsuranceReimbursement } from '@/lib/calculations'

interface HealthInsuranceSectionProps {
  health: HealthInsuranceExpenses
  onChange: (field: keyof HealthInsuranceExpenses, value: number) => void
}

export function HealthInsuranceSection({ health, onChange }: HealthInsuranceSectionProps) {
  const total = calcHealthInsuranceReimbursement(health)

  return (
    <Card
      title="Health Insurance"
      headerExtra={
        <Typography variant="small" as="span">100% deductible</Typography>
      }
    >
      <Grid cols={3} className="gap-4">
        <div className="grid grid-cols-[1fr] items-center gap-1">
          <Field>
            <Label htmlFor="hi-health-monthly">Health</Label>
            <Input
              id="hi-health-monthly"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              prefix="$"
              value={health.health || ''}
              onChange={(e) => onChange('health', Number(e.target.value) || 0)}
            />
          </Field>
          <div className="text-right">
            <Typography variant="small" className="mb-0.5">Reimburse</Typography>
            <Typography variant="label" numeric>${health.health.toFixed(2)}</Typography>
          </div>
        </div>

        <div className="grid grid-cols-[1fr] items-center gap-1">
          <Field>
            <Label htmlFor="hi-dental-monthly">Dental</Label>
            <Input
              id="hi-dental-monthly"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              prefix="$"
              value={health.dental || ''}
              onChange={(e) => onChange('dental', Number(e.target.value) || 0)}
            />
          </Field>
          <div className="text-right">
            <Typography variant="small" className="mb-0.5">Reimburse</Typography>
            <Typography variant="label" numeric>${health.dental.toFixed(2)}</Typography>
          </div>
        </div>

        <div className="grid grid-cols-[1fr] items-center gap-1">
          <Field>
            <Label htmlFor="hi-vision-monthly">Vision</Label>
            <Input
              id="hi-vision-monthly"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              prefix="$"
              value={health.vision || ''}
              onChange={(e) => onChange('vision', Number(e.target.value) || 0)}
            />
          </Field>
          <div className="text-right">
            <Typography variant="small" className="mb-0.5">Reimburse</Typography>
            <Typography variant="label" numeric>${health.vision.toFixed(2)}</Typography>
          </div>
        </div>
      </Grid>

      <Separator />
      <LineItem label="Section total" value={`$${total.toFixed(2)}`} />
    </Card>
  )
}
