import { Paperclip } from 'lucide-react'
import { Card, Separator, Typography } from '@/components/ui'
import type { Donation } from '@/types'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

interface GivingLogProps {
  donations: Donation[]
  ytdTotal: number
}

export function GivingLog({ donations, ytdTotal }: GivingLogProps) {
  const receiptCount = donations.filter((d) => d.receiptName).length

  return (
    <Card title="YTD Giving Log">
      {donations.length === 0 ? (
          <Typography variant="muted" className="py-4 text-center">No donations logged yet.</Typography>
        ) : (
          <div className="space-y-0">
            <Typography variant="caption" as="div" className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 pb-2">
              <span>Date / Organization</span>
              <span className="text-right">Amount</span>
              <span>Receipt</span>
            </Typography>
            <Separator />
            {donations.map((d) => (
              <div key={d.id}>
                <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 py-2.5 items-center">
                  <div>
                    <Typography variant="label">{d.organization}</Typography>
                    <Typography variant="small">{d.date}</Typography>
                  </div>
                  <Typography variant="label" as="span" numeric>{fmt(d.amount)}</Typography>
                  <span>
                    {d.receiptName
                      ? <Paperclip className="h-3.5 w-3.5 text-muted-foreground" aria-label={d.receiptName} />
                      : <span className="text-muted-foreground/40">—</span>
                    }
                  </span>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        )}

        {donations.length > 0 && (
          <div className="pt-2 space-y-1">
            <div className="flex justify-between">
              <Typography variant="label" as="span">YTD Total</Typography>
              <Typography variant="amount" as="span">{fmt(ytdTotal)}</Typography>
            </div>
            <Separator className="my-2" />
            <Typography variant="caption">For your accountant</Typography>
            <Typography variant="small">
              YTD total: {fmt(ytdTotal)} · {receiptCount} of {donations.length} receipts attached
            </Typography>
          </div>
        )}
    </Card>
  )
}
