import { Card, ListItem, Typography } from '@/ui'
import { calcMileageReimbursement, MILEAGE_RATE_PER_MILE } from '../utils/calculations'
import { ReimbursementField } from './ReimbursementField'

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
      footer={
        <ListItem title="Mileage total" lineItem={`$${reimbursement.toFixed(2)}`} />
      }
    >
      <ReimbursementField
        id="business-miles"
        label="Business miles driven"
        value={miles}
        reimbursement={reimbursement}
        step="1"
        placeholder="0"
        onChange={onChange}
      />
    </Card>
  )
}
