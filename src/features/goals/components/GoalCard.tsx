import { useState } from 'react'
import { Button, ButtonGroup, Card, Dialog, Field, Grid, Input, Label, Progress, StatItem, Typography } from '@/ui'
import { calcQuartersToGoal, calcProgressPct } from '../utils/calculations'
import type { Goal } from '../types'
import { Trash2 } from 'lucide-react'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

interface GoalCardProps {
  goal: Goal
  onUpdate: (patch: Partial<Omit<Goal, 'id'>>) => void
  onDelete: () => void
}

export function GoalCard({ goal, onUpdate, onDelete }: GoalCardProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ ...goal })
  const [confirmingDelete, setConfirmingDelete] = useState(false)

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
    setEditing(false)
  }

  function handleCancel() {
    setDraft({ ...goal })
    setEditing(false)
  }

  if (editing) {
    return (
      <Card title={`Edit: ${goal.name}`}>
        <Grid cols={2}>
          <Field className="sm:col-span-2">
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
              value={draft.targetAmount || ''}
              onChange={(e) => setDraft((d) => ({ ...d, targetAmount: Number(e.target.value) || 0 }))}
            />
          </Field>
          <Field>
            <Label htmlFor={`current-${goal.id}`}>Currently Saved ($)</Label>
            <Input
              id={`current-${goal.id}`}
              type="number"
              value={draft.currentAmount || ''}
              onChange={(e) => setDraft((d) => ({ ...d, currentAmount: Number(e.target.value) || 0 }))}
            />
          </Field>
          <Field>
            <Label htmlFor={`contrib-${goal.id}`}>Quarterly Contribution ($)</Label>
            <Input
              id={`contrib-${goal.id}`}
              type="number"
              value={draft.quarterlyContribution || ''}
              onChange={(e) => setDraft((d) => ({ ...d, quarterlyContribution: Number(e.target.value) || 0 }))}
            />
          </Field>
        </Grid>
        <ButtonGroup>
          <Button size="sm" onClick={handleSave}>Save</Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
        </ButtonGroup>
      </Card>
    )
  }

  return (
    <>
      <Card title={goal.name}>
        <div className="space-y-3">
          <Grid>
            <StatItem label="Target" value={fmt(goal.targetAmount)} />
            <StatItem label="Saved" value={fmt(goal.currentAmount)} />
            <StatItem label="Per Quarter" value={fmt(goal.quarterlyContribution)} />
          </Grid>

          <div className="space-y-1">
            <div className="flex justify-between">
              <Typography variant="muted" as="span">{pct.toFixed(0)}% complete</Typography>
              <Typography variant="small" as="span">
                {quarters !== Infinity ? `~${years} yrs at ${fmt(goal.quarterlyContribution)}/q` : 'Set a contribution'}
              </Typography>
            </div>
            <Progress value={pct} className="h-2" />
          </div>

          <ButtonGroup>
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Edit</Button>
            <Button size="sm" variant="secondary" onClick={() => setConfirmingDelete(true)}><Trash2 /></Button>
          </ButtonGroup>
        </div>
      </Card>

      <Dialog
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        title={`Delete "${goal.name}"?`}
        description="This will permanently remove this goal and its progress. This cannot be undone."
        footer={
          <ButtonGroup>
            <Button variant="outline" onClick={() => setConfirmingDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setConfirmingDelete(false); onDelete() }}>Delete</Button>
          </ButtonGroup>
        }
      />
    </>
  )
}
