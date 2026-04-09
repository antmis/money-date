import { useState } from 'react'
import { PageContainer } from '@/shared/layout'
import { SectionHeader } from '@/shared/components'
import { PageSkeleton } from '@/shared/components'
import { Card, Typography, XStack, YStack, Separator } from '@/ui'
import { GoalCard, GoalDialog, useGoals } from '@/features/goals'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export function Goals() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { goals, totalGoalsPerQ, addGoal, updateGoal, deleteGoal, loading } = useGoals()

  if (loading) return <PageSkeleton />

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

      <YStack gap={4}>
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onUpdate={(patch) => updateGoal(goal.id, patch)}
            onDelete={() => deleteGoal(goal.id)}
          />
        ))}
      </YStack>

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

      <GoalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={addGoal}
      />
    </PageContainer>
  )
}
