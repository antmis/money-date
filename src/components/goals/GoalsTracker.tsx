import { Card, Input, Label, Progress, Typography } from '@/components/ui'
import { calcQuartersToGoal, calcProgressPct } from '@/lib/calculations'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

interface GoalsTrackerProps {
  homeTarget: number
  homeCurrent: number
  homeContribution: number
  onTargetChange: (n: number) => void
  onCurrentChange: (n: number) => void
  onContributionChange: (n: number) => void
}

export function GoalsTracker({
  homeTarget,
  homeCurrent,
  homeContribution,
  onTargetChange,
  onCurrentChange,
  onContributionChange,
}: GoalsTrackerProps) {
  const pct = calcProgressPct(homeCurrent, homeTarget)
  const quarters = calcQuartersToGoal(homeTarget, homeCurrent, homeContribution)
  const years = quarters !== Infinity ? (quarters / 4).toFixed(1) : '—'

  return (
    <Card title="Home Savings">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="home-target">Target Amount</Label>
          <Input
            id="home-target"
            type="number"
            value={homeTarget || ''}
            onChange={(e) => onTargetChange(Number(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="home-current">Currently Saved</Label>
          <Input
            id="home-current"
            type="number"
            value={homeCurrent || ''}
            onChange={(e) => onCurrentChange(Number(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="home-contribution">Quarterly Contribution</Label>
          <Input
            id="home-contribution"
            type="number"
            value={homeContribution || ''}
            onChange={(e) => onContributionChange(Number(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Typography variant="muted" as="span">{fmt(homeCurrent)} saved</Typography>
          <Typography variant="label" as="span">{pct.toFixed(0)}%</Typography>
        </div>
        <Progress value={pct} className="h-2" />
        <Typography variant="small">
          Goal: {fmt(homeTarget)} · {quarters !== Infinity ? `~${years} years at ${fmt(homeContribution)}/quarter` : 'Set a contribution to project timeline'}
        </Typography>
      </div>
    </Card>
  )
}
