import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Button, Card, Dialog, Field, Input, Label, ListItem, Typography, XStack, YStack } from '@/ui'
import type { PhoneInternetExpenses } from '../../types'
import { calcPhoneInternetReimbursement } from '../../utils/calculations'
import { ReimbursementField } from '../ReimbursementField'

interface PhoneInternetSectionProps {
  expenses: PhoneInternetExpenses
  onChange: (field: keyof PhoneInternetExpenses, value: number) => void
}

export function PhoneInternetSection({ expenses, onChange }: PhoneInternetSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const total = calcPhoneInternetReimbursement(expenses)

  return (
    <>
    <Card
      title="Phone & Internet"
      footer={<ListItem title="Phone & Internet Total" lineItem={`$${total.toFixed(2)}`} />}
    >
      <ListItem
        title="Business Usage"
        subTitle="Adjust the percentage of each bill that is for business use."
        lineItem={
          <XStack gap={1}>
            <YStack className="items-end">
              <Typography variant="small">Internet: {expenses.internetUsage}%</Typography>
              <Typography variant="small">Phone: {expenses.phoneUsage}%</Typography>
            </YStack>
            <Button
              variant="secondary"
              size="icon-sm"
              onClick={() => setDialogOpen(true)}
            >
              <Pencil />
            </Button>
          </XStack>
        }
      />

      <ReimbursementField
        id="internet-cost"
        label="Internet (full cost)"
        value={expenses.internet}
        reimbursement={expenses.internet * (expenses.internetUsage / 100)}
        prefix="$"
        onChange={(v) => onChange('internet', v)}
      />
      <ReimbursementField
        id="phone-cost"
        label="Phone (full cost)"
        value={expenses.phone}
        reimbursement={expenses.phone * (expenses.phoneUsage / 100)}
        prefix="$"
        onChange={(v) => onChange('phone', v)}
      />
    </Card>

    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => { if (!open) setDialogOpen(false) }}
      title="Business Usage"
      description="Set the percentage of each bill that is for business use."
      className="max-w-sm"
      footer={
        <XStack justify="end">
          <Button onClick={() => setDialogOpen(false)}>Done</Button>
        </XStack>
      }
    >
      <Field>
        <Label htmlFor="internet-usage">Internet business usage</Label>
        <Input
          id="internet-usage"
          type="number"
          min="0"
          max="100"
          step="1"
          placeholder="50"
          suffix="%"
          value={expenses.internetUsage || ''}
          onChange={(e) => onChange('internetUsage', Number(e.target.value) || 0)}
        />
      </Field>
      <Field>
        <Label htmlFor="phone-usage">Phone business usage</Label>
        <Input
          id="phone-usage"
          type="number"
          min="0"
          max="100"
          step="1"
          placeholder="50"
          suffix="%"
          value={expenses.phoneUsage || ''}
          onChange={(e) => onChange('phoneUsage', Number(e.target.value) || 0)}
        />
      </Field>
    </Dialog>
    </>
  )
}
