import { useState } from 'react'
import { toast } from 'sonner'
import { Card, Button, ListItem, Typography, YStack } from '@/ui'
import type { HealthInsuranceExpenses } from '../types'
import { calcHealthInsuranceReimbursement } from '../utils/calculations'
import { ReimbursementField } from './ReimbursementField'
import { Spinner } from '@/ui/spinner'

interface HealthInsuranceSectionProps {
  health: HealthInsuranceExpenses
  onChange: (field: keyof HealthInsuranceExpenses, value: number) => void
  onSave?: () => Promise<void>
}

export function HealthInsuranceSection({ health, onChange, onSave }: HealthInsuranceSectionProps) {
  const [isSaving, setIsSaving] = useState(false)
  const total = calcHealthInsuranceReimbursement(health)

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
      title="Health Insurance"
      headerExtra={
        <Typography variant="small" as="span">100% deductible</Typography>
      }
      footer={
        <YStack>
          <ListItem title="Insurance Total" lineItem={`$${total.toFixed(2)}`} />
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Spinner /> : "Save Reimbursement"}
          </Button>
        </YStack>
      }
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
