import { useState } from 'react'
import { PageContainer } from '@/shared/layout'
import { SectionHeader } from '@/shared/components'
import { GoalCard, useGoals } from '@/features/goals'
import { Button, Dialog, Input, Label, Separator, Typography, Field, XStack, YStack, Card, Grid } from '@/ui'
import { PageSkeleton } from '@/shared/components'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const BLANK = { name: '', targetAmount: 0, currentAmount: 0, quarterlyContribution: 0 }

export function Goals() {
  const { goals, totalGoalsPerQ, addGoal, updateGoal, deleteGoal, loading } = useGoals()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draft, setDraft] = useState({ ...BLANK })

  if (loading) return <PageSkeleton />

  function handleAdd() {
    if (!draft.name.trim()) return
    addGoal(draft)
    setDraft({ ...BLANK })
    setDialogOpen(false)
  }

  function handleOpenChange(open: boolean) {
    if (!open) setDraft({ ...BLANK })
    setDialogOpen(open)
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Goals"
        description="Quarterly savings targets — these set the Goals line in Allocate."
        buttonAction={() => setDialogOpen(true)}
        buttonText="Add Goal"
      />

      {goals.length === 0 && (
        <Card>
          <Typography variant="muted" className="py-4 text-center">
            No goals yet. Click "+ Add Goal" to get started.
          </Typography>
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

      {goals.length > 0 && (
        <XStack align="center">
          <Separator className="flex-1 mr-4" />
          <Typography variant="muted" as="span" className="whitespace-nowrap">
            Total quarterly goals:{' '}
            <Typography variant="amount" as="span" color="foreground">{fmt(totalGoalsPerQ)}</Typography>
            {' '}— this flows into Allocate
          </Typography>
        </XStack>
      )}

      <Dialog
        open={dialogOpen}
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

          <Field className="md:col-span-2">
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
    </PageContainer>
  )
}
