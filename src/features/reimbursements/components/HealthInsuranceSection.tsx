import { Card, ListItem, Typography } from '@/ui'
import type { HealthInsuranceExpenses } from '../types'
import { calcHealthInsuranceReimbursement } from '../utils/calculations'
import { ReimbursementField } from './ReimbursementField'

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
      footer={<ListItem title="Insurance Total" lineItem={`$${total.toFixed(2)}`} />}
    >
      <ReimbursementField
        id="insurance-health-monthly"
        label="Health"
        value={health.health}
        reimbursement={health.health}
        prefix="$"
        onChange={(v) => onChange('health', v)}
      />
      <ReimbursementField
        id="insurance-dental-monthly"
        label="Dental"
        value={health.dental}
        reimbursement={health.dental}
        prefix="$"
        onChange={(v) => onChange('dental', v)}
      />
      <ReimbursementField
        id="insurance-vision-monthly"
        label="Vision"
        value={health.vision}
        reimbursement={health.vision}
        prefix="$"
        onChange={(v) => onChange('vision', v)}
      />
    </Card>
  )
}
