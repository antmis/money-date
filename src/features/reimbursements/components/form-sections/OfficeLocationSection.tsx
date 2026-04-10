import { Pencil } from 'lucide-react'
import { Card, Button, ListItem } from '@/ui'
import type { OfficeMonthlyData } from '../../types'
import { calcOfficeRate, calcOfficeReimbursement } from '../../utils/calculations'
import { ReimbursementField } from '../ReimbursementField'

interface OfficeLocationSectionProps {
  office: OfficeMonthlyData
  onChange: (field: keyof OfficeMonthlyData, value: number | string) => void
  onEdit?: () => void
  onDelete?: () => void
}

export function OfficeLocationSection({ office, onChange, onEdit }: OfficeLocationSectionProps) {
  const rate = calcOfficeRate(office)
  const total = calcOfficeReimbursement(office)
  const ratePct = (rate * 100).toFixed(1)
  const slug = office.templateId

  return (
    <Card
      title={office.name || "Home Office"}
      description={office.address}
      headerExtra=
        {onEdit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onEdit}
          >
            <Pencil /> Edit
          </Button>
        )}
      footer={<ListItem title={`${office.name} Total`} lineItem={`$${total.toFixed(2)}`} />}
    >
      <ListItem 
        title="Reimbursement Rate:" 
        lineItem={`${office.officeSqft} / ${office.totalSqft} sq ft: ${ratePct}%`} 
      />
      
      <ReimbursementField label="Rent" id={`${slug}-rent`} value={office.rent} reimbursement={office.rent * rate} prefix="$" onChange={(v) => onChange('rent', v)} />
      <ReimbursementField label="Utilities" id={`${slug}-utilities`} value={office.utilities} reimbursement={office.utilities * rate} prefix="$" onChange={(v) => onChange('utilities', v)} />
      <ReimbursementField label="Rent Insurance" id={`${slug}-rentInsurance`} value={office.rentInsurance} reimbursement={office.rentInsurance * rate} prefix="$" onChange={(v) => onChange('rentInsurance', v)} />
      <ReimbursementField label="Alarm & Security" id={`${slug}-alarm`} value={office.alarm} reimbursement={office.alarm * rate} prefix="$" onChange={(v) => onChange('alarm', v)} />
      <ReimbursementField label="Cleaning" id={`${slug}-cleaning`} value={office.cleaning} reimbursement={office.cleaning * rate} prefix="$" onChange={(v) => onChange('cleaning', v)} />
    </Card>
  )
}
