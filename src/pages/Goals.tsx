import { PageContainer } from '@/components/layout/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { GoalsTracker } from '@/components/goals/GoalsTracker'
import { Card, Input, Label, Separator, Typography } from '@/components/ui'
import { useGoals } from '@/hooks/useGoals'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export function Goals() {
  const goals = useGoals()

  return (
    <PageContainer>
      <SectionHeader
        title="Goals"
        description="Quarterly savings targets — these set the Goals line in Allocate."
      />

      <GoalsTracker
        homeTarget={goals.homeTarget}
        homeCurrent={goals.homeCurrent}
        homeContribution={goals.homeContribution}
        onTargetChange={(v) => goals.update({ homeTarget: v })}
        onCurrentChange={(v) => goals.update({ homeCurrent: v })}
        onContributionChange={(v) => goals.update({ homeContribution: v })}
      />

      <Card title="Truck Savings">
        <div className="space-y-2 max-w-xs">
          <Label htmlFor="truck-savings">Per quarter</Label>
          <Input
            id="truck-savings"
            type="number"
            value={goals.truckSavingsPerQ || ''}
            onChange={(e) => goals.update({ truckSavingsPerQ: Number(e.target.value) || 0 })}
          />
        </div>
      </Card>

      <div className="flex items-center justify-between px-1">
        <Separator className="flex-1 mr-4" />
        <Typography variant="muted" as="span" className="whitespace-nowrap">
          Total quarterly goals:{' '}
          <Typography variant="amount" as="span" color="foreground">{fmt(goals.totalGoalsPerQ)}</Typography>
          {' '}— this flows into Allocate
        </Typography>
      </div>
    </PageContainer>
  )
}
