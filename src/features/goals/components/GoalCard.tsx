import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Button, Card, ConfirmDeleteDialog, Dialog, Field, Grid, Input, Label, ListItem, Progress, XStack, YStack, Typography } from '@/ui'
import { calcQuartersToGoal, calcProgressPct } from '../utils/calculations'
import type { Goal } from '../types'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

interface GoalCardProps {
  goal: Goal
  onUpdate: (patch: Partial<Omit<Goal, 'id'>>) => void
  onDelete: () => void
}

export function GoalCard({ goal, onUpdate, onDelete }: GoalCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [draft, setDraft] = useState({ ...goal })
  const [confirmDelete, setConfirmDelete] = useState(false)

  const pct = calcProgressPct(goal.currentAmount, goal.targetAmount)
  const quarters = calcQuartersToGoal(goal.targetAmount, goal.currentAmount, goal.quarterlyContribution)
  const years = quarters !== Infinity ? (quarters / 4).toFixed(1) : '—'

  function handleSave() {
    onUpdate({
      name: draft.name,
      targetAmount: draft.targetAmount,
      currentAmount: draft.currentAmount,
      quarterlyContribution: draft.quarterlyContribution,
    })
    setEditOpen(false)
  }

  function handleOpenChange(open: boolean) {
    if (!open) setDraft({ ...goal })
    setEditOpen(open)
  }

  return (
    <>
      <Card
        title={goal.name}
        headerExtra={
          <Button variant="ghost" size="icon-sm" onClick={() => setEditOpen(true)} aria-label="Edit goal">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        }
      >
        <Grid>
          <ListItem title="Target" subTitle={fmt(goal.targetAmount)} />
          <ListItem title="Saved" subTitle={fmt(goal.currentAmount)} />
          <ListItem title="Per Quarter" subTitle={fmt(goal.quarterlyContribution)} />
        </Grid>

        <YStack gap={1}>
          <XStack justify="between">
            <Typography variant="muted" as="span">{pct.toFixed(0)}% complete</Typography>
            <Typography variant="small" as="span">
              {quarters !== Infinity ? `~${years} yrs at ${fmt(goal.quarterlyContribution)}/q` : 'Set a contribution'}
            </Typography>
          </XStack>
          <Progress value={pct} className="h-2" />
        </YStack>
      </Card>

      <Dialog
        open={editOpen}
        onOpenChange={handleOpenChange}
        title={`Edit: ${goal.name}`}
        className="max-w-md"
        footer={
          <XStack justify="between" className="w-full">
            <Button variant="destructive" onClick={() => setConfirmDelete(true)}>Delete</Button>
            <XStack gap={2}>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={!draft.name.trim()}>Save</Button>
            </XStack>
          </XStack>
        }
      >
        <YStack gap={4}>
          <Grid cols={2} className="gap-3">
            <Field className="col-span-2">
              <Label htmlFor={`name-${goal.id}`}>Goal Name</Label>
              <Input
                id={`name-${goal.id}`}
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              />
            </Field>
            <Field>
              <Label htmlFor={`target-${goal.id}`}>Target ($)</Label>
              <Input
                id={`target-${goal.id}`}
                type="number"
                prefix="$"
                value={draft.targetAmount || ''}
                onChange={(e) => setDraft((d) => ({ ...d, targetAmount: Number(e.target.value) || 0 }))}
              />
            </Field>
            <Field>
              <Label htmlFor={`current-${goal.id}`}>Currently Saved ($)</Label>
              <Input
                id={`current-${goal.id}`}
                type="number"
                prefix="$"
                value={draft.currentAmount || ''}
                onChange={(e) => setDraft((d) => ({ ...d, currentAmount: Number(e.target.value) || 0 }))}
              />
            </Field>
            <Field className="col-span-2">
              <Label htmlFor={`contrib-${goal.id}`}>Quarterly Contribution ($)</Label>
              <Input
                id={`contrib-${goal.id}`}
                type="number"
                prefix="$"
                value={draft.quarterlyContribution || ''}
                onChange={(e) => setDraft((d) => ({ ...d, quarterlyContribution: Number(e.target.value) || 0 }))}
              />
            </Field>
          </Grid>
        </YStack>
      </Dialog>

      <ConfirmDeleteDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onConfirm={() => { setEditOpen(false); onDelete() }}
        description={`"${goal.name}" will be permanently deleted.`}
      />
    </>
  )
}
