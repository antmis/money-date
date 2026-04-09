import { useState } from 'react'
import { Button, Dialog, Input, Label, Field, XStack, YStack, Grid } from '@/ui'
import type { Goal } from '../types'

type GoalDraft = Omit<Goal, 'id'>

const BLANK: GoalDraft = { name: '', targetAmount: 0, currentAmount: 0, quarterlyContribution: 0 }

interface GoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (draft: GoalDraft) => void
}

export function GoalDialog({ open, onOpenChange, onAdd }: GoalDialogProps) {
  const [draft, setDraft] = useState<GoalDraft>({ ...BLANK })

  function handleOpenChange(next: boolean) {
    if (!next) setDraft({ ...BLANK })
    onOpenChange(next)
  }

  function handleAdd() {
    if (!draft.name.trim()) return
    onAdd(draft)
    setDraft({ ...BLANK })
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="New Goal"
      className="max-w-md"
      footer={
        <XStack gap={2}>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!draft.name.trim()}>Add Goal</Button>
        </XStack>
      }
    >
      <YStack gap={4}>
        <Field>
          <Label htmlFor="new-name">Goal Name</Label>
          <Input
            id="new-name"
            placeholder="e.g. Home down payment"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          />
        </Field>
        <Grid cols={2}>
          <Field>
            <Label htmlFor="new-target">Target ($)</Label>
            <Input
              id="new-target"
              type="number"
              prefix="$"
              value={draft.targetAmount || ''}
              onChange={(e) => setDraft((d) => ({ ...d, targetAmount: Number(e.target.value) || 0 }))}
            />
          </Field>
          <Field>
            <Label htmlFor="new-current">Currently Saved ($)</Label>
            <Input
              id="new-current"
              type="number"
              prefix="$"
              value={draft.currentAmount || ''}
              onChange={(e) => setDraft((d) => ({ ...d, currentAmount: Number(e.target.value) || 0 }))}
            />
          </Field>
        </Grid>
        <Field>
          <Label htmlFor="new-contrib">Quarterly Contribution ($)</Label>
          <Input
            id="new-contrib"
            type="number"
            prefix="$"
            value={draft.quarterlyContribution || ''}
            onChange={(e) => setDraft((d) => ({ ...d, quarterlyContribution: Number(e.target.value) || 0 }))}
          />
        </Field>
      </YStack>
    </Dialog>
  )
}
