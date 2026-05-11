import { useState, useEffect } from 'react'
import { Dialog } from '@/ui'
import { Field, Input, Label, Button, XStack } from '@/ui'

interface CashEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  value: number
  onSave: (value: number) => void
}

export function CashEditDialog({ open, onOpenChange, title, value, onSave }: CashEditDialogProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  function handleSave() {
    onSave(draft)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={
        <XStack gap={2}>
          <Button
            onClick={() => onOpenChange(false)}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
          >
            Save
          </Button>
        </XStack>
      }
    >
      <Field>
        <Label htmlFor="cash-edit-input">Balance</Label>
        <Input
          id="cash-edit-input"
          type="number"
          placeholder="0"
          value={draft || ''}
          onChange={(e) => setDraft(Number(e.target.value) || 0)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
      </Field>
    </Dialog>
  )
}
