import { useState } from 'react'
import { PageContainer } from '@/shared/layout'
import { SectionHeader } from '@/shared/components'
import { GoalCard, useGoals } from '@/features/goals'
import { Button, Card, Grid, Input, Label, Separator, Typography, Field, ButtonGroup } from '@/ui'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const BLANK = { name: '', targetAmount: 0, currentAmount: 0, quarterlyContribution: 0 }

export function Goals() {
  const { goals, totalGoalsPerQ, addGoal, updateGoal, deleteGoal } = useGoals()
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ ...BLANK })

  function handleAdd() {
    if (!draft.name.trim()) return
    addGoal(draft)
    setDraft({ ...BLANK })
    setAdding(false)
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Goals"
        description="Quarterly savings targets — these set the Goals line in Allocate."
      />

      {goals.length === 0 && !adding && (
        <Card title="No goals yet" description="Add your first goal to start tracking progress and projecting your timeline.">
          <Button onClick={() => setAdding(true)}>Add goal</Button>
        </Card>
      )}

      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onUpdate={(patch) => updateGoal(goal.id, patch)}
          onDelete={() => deleteGoal(goal.id)}
        />
      ))}

      {adding ? (
        <Card title="New Goal">
          <Grid cols={2}>
            <Field>
              <Label htmlFor="new-name">Goal Name</Label>
              <Input
                id="new-name"
                placeholder="e.g. Home down payment"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              />
            </Field>
            <Field>
              <Label htmlFor="new-target">Target ($)</Label>
              <Input
                id="new-target"
                type="number"
                value={draft.targetAmount || ''}
                onChange={(e) => setDraft((d) => ({ ...d, targetAmount: Number(e.target.value) || 0 }))}
              />
            </Field>
            <Field>
              <Label htmlFor="new-current">Currently Saved ($)</Label>
              <Input
                id="new-current"
                type="number"
                value={draft.currentAmount || ''}
                onChange={(e) => setDraft((d) => ({ ...d, currentAmount: Number(e.target.value) || 0 }))}
              />
            </Field>
            <Field>
              <Label htmlFor="new-contrib">Quarterly Contribution ($)</Label>
              <Input
                id="new-contrib"
                type="number"
                value={draft.quarterlyContribution || ''}
                onChange={(e) => setDraft((d) => ({ ...d, quarterlyContribution: Number(e.target.value) || 0 }))}
              />
            </Field>
          </Grid>
          <ButtonGroup>
            <Button size="sm" onClick={handleAdd}>Add Goal</Button>
            <Button size="sm" variant="outline" onClick={() => { setAdding(false); setDraft({ ...BLANK }) }}>Cancel</Button>
          </ButtonGroup>
        </Card>
      ) : goals.length > 0 && (
        <Button onClick={() => setAdding(true)}>Add goal</Button>
      )}

      {goals.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <Separator className="flex-1 mr-4" />
          <Typography variant="muted" as="span" className="whitespace-nowrap">
            Total quarterly goals:{' '}
            <Typography variant="amount" as="span" color="foreground">{fmt(totalGoalsPerQ)}</Typography>
            {' '}— this flows into Allocate
          </Typography>
        </div>
      )}
    </PageContainer>
  )
}
