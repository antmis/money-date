import { Pencil } from 'lucide-react'
import { Card, Button, ListItem, Typography, YStack, XStack } from '@/ui'
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
  const hasLocation = office.address || office.officeSqft > 0 || office.totalSqft > 0

  return (
    <Card
      footer={<ListItem title={`${office.name} Total`} lineItem={`$${total.toFixed(2)}`} />}
    >
      {hasLocation && (
        <ListItem
          title={office.name}
          subTitle={office.address && (
            `${office.address}`
          )}
          lineItem={
            <XStack gap={1}>
              <YStack className="items-end">
                {(office.officeSqft > 0 || office.totalSqft > 0) && (
                  <Typography variant="small">{office.officeSqft} / {office.totalSqft} sq ft</Typography>
                )}
                <Typography variant="small">{ratePct}% reimbursement</Typography>
              </YStack>
              {onEdit && (
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={onEdit}
                >
                  <Pencil />
                </Button>
              )}
            </XStack>
          }
        />
      )}

      <YStack gap={4}>
        <ReimbursementField label="Rent" id={`${slug}-rent`} value={office.rent} reimbursement={office.rent * rate} prefix="$" onChange={(v) => onChange('rent', v)} />
        <ReimbursementField label="Utilities" id={`${slug}-utilities`} value={office.utilities} reimbursement={office.utilities * rate} prefix="$" onChange={(v) => onChange('utilities', v)} />
        <ReimbursementField label="Rent Insurance" id={`${slug}-rentInsurance`} value={office.rentInsurance} reimbursement={office.rentInsurance * rate} prefix="$" onChange={(v) => onChange('rentInsurance', v)} />
        <ReimbursementField label="Alarm & Security" id={`${slug}-alarm`} value={office.alarm} reimbursement={office.alarm * rate} prefix="$" onChange={(v) => onChange('alarm', v)} />
        <ReimbursementField label="Cleaning" id={`${slug}-cleaning`} value={office.cleaning} reimbursement={office.cleaning * rate} prefix="$" onChange={(v) => onChange('cleaning', v)} />
      </YStack>
    </Card>
  )
}
