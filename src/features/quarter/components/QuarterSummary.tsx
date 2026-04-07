import { Card, ListGroup, ListItem, Typography } from '@/ui'
import type { PaymentAllocation } from '@/features/allocate'

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
      <ListGroup>
        <ListItem title="Income Received" lineItem={fmt(income)} />
        <ListItem title="Tax Reserve" lineItem={fmt(breakdown.taxReserve)} />
        <ListItem title="SEP IRA" lineItem={fmt(breakdown.sepIra)} />
        <ListItem title="Giving" lineItem={fmt(breakdown.giving)} />
        <ListItem title="Goals" lineItem={fmt(breakdown.goals)} />
        <ListItem title="Distribution" lineItem={fmt(breakdown.discretionary)} />
      </ListGroup>
    </Card>
  )
}
