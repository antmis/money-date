import { Card, Separator, Typography } from '@/components/ui'
import type { PaymentAllocation } from '@/types'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

interface QuarterSummaryProps {
  income: number
  breakdown: PaymentAllocation
}

export function QuarterSummary({ income, breakdown }: QuarterSummaryProps) {
  if (income <= 0) {
    return (
      <Card>
        <Typography variant="muted" className="text-center py-8">
          Enter income received to see your distribution breakdown.
        </Typography>
      </Card>
    )
  }

  return (
    <Card title="Income Breakdown">
      <div className="flex items-center justify-between py-2">
        <Typography variant="label" as="span">Income Received</Typography>
        <Typography variant="amount">{fmt(income)}</Typography>
      </div>
      <Separator />
      <div className="flex items-center justify-between py-2">
        <Typography variant="body" as="span">Tax Reserve</Typography>
        <Typography variant="amount" color="deduction">{fmt(breakdown.taxReserve)}</Typography>
      </div>
      <Separator />
      <div className="flex items-center justify-between py-2">
        <Typography variant="body" as="span">SEP IRA</Typography>
        <Typography variant="amount" color="savings">{fmt(breakdown.sepIra)}</Typography>
      </div>
      <Separator />
      <div className="flex items-center justify-between py-2">
        <Typography variant="body" as="span">Giving</Typography>
        <Typography variant="amount" color="giving">{fmt(breakdown.giving)}</Typography>
      </div>
      <Separator />
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Typography variant="body" as="span">Goals</Typography>
          <Typography variant="small" as="span">fixed</Typography>
        </div>
        <Typography variant="amount" color="goals">{fmt(breakdown.goals)}</Typography>
      </div>
      <Separator />
      <div className="flex items-center justify-between py-2">
        <Typography variant="label" as="span">Distribution</Typography>
        <Typography variant="amount">{fmt(breakdown.discretionary)}</Typography>
      </div>
    </Card>
  )
}
