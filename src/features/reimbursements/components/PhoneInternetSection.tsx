import { useState } from 'react'
import { toast } from 'sonner'
import { Card, Button, ListItem, Typography, YStack } from '@/ui'
import type { PhoneInternetExpenses } from '../types'
import { calcPhoneInternetReimbursement, PHONE_INTERNET_RATE } from '../utils/calculations'
import { ReimbursementField } from './ReimbursementField'
import { Spinner } from '@/ui/spinner'

interface PhoneInternetSectionProps {
  expenses: PhoneInternetExpenses
  onChange: (field: keyof PhoneInternetExpenses, value: number) => void
  onSave?: () => Promise<void>
}

export function PhoneInternetSection({ expenses, onChange, onSave }: PhoneInternetSectionProps) {
  const [isSaving, setIsSaving] = useState(false)
  const total = calcPhoneInternetReimbursement(expenses)

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
      title="Phone & Internet"
      headerExtra={
        <Typography variant="small" as="span">{(PHONE_INTERNET_RATE * 100).toFixed(0)}% business usage</Typography>
      }
      footer={
        <YStack>
          <ListItem title="Phone & Internet Total" lineItem={`$${total.toFixed(2)}`} />
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Spinner /> : "Save Reimbursement"}
          </Button>
        </YStack>
      }
    >
      <ReimbursementField
        id="internet-cost"
        label="Internet (full cost)"
        value={expenses.internet}
        reimbursement={expenses.internet * PHONE_INTERNET_RATE}
        prefix="$"
        onChange={(v) => onChange('internet', v)}
      />
      <ReimbursementField
        id="phone-cost"
        label="Phone (full cost)"
        value={expenses.phone}
        reimbursement={expenses.phone * PHONE_INTERNET_RATE}
        prefix="$"
        onChange={(v) => onChange('phone', v)}
      />
    </Card>
  )
}
