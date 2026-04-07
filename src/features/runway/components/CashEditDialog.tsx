import { useState, useEffect } from 'react'
import { Dialog } from '@/ui'
import { Field, Input, Label } from '@/ui'

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
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="px-3 py-1.5 text-sm rounded border border-input bg-background hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Save
          </button>
        </div>
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
          autoFocus
        />
      </Field>
    </Dialog>
  )
}
