import { useState } from 'react'
import { toast } from 'sonner'
import { Card, Button, ListItem, Typography, YStack } from '@/ui'
import { calcMileageReimbursement, MILEAGE_RATE_PER_MILE } from '../utils/calculations'
import { ReimbursementField } from './ReimbursementField'
import { Spinner } from '@/ui/spinner'

interface MileageSectionProps {
  miles: number
  onChange: (miles: number) => void
  onSave?: () => Promise<void>
}

export function MileageSection({ miles, onChange, onSave }: MileageSectionProps) {
  const [isSaving, setIsSaving] = useState(false)
  const reimbursement = calcMileageReimbursement(miles)

  async function handleSave() {
    if (!onSave) return
    setIsSaving(true)
    try {
      await onSave()
      toast('Reimbursement saved')
    } catch {
      toast.error('Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card
      title="Mileage"
      headerExtra={
        <Typography variant="small" as="span">${MILEAGE_RATE_PER_MILE.toFixed(2)}/mile (2026 IRS)</Typography>
      }
      footer={
        <YStack>
          <ListItem title="Mileage Total" lineItem={`$${reimbursement.toFixed(2)}`} />
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Spinner /> : "Save Reimbursement"}
          </Button>
        </YStack>
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
