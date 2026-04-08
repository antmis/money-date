import { Paperclip } from 'lucide-react'
import { Card, Typography, Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, XStack } from '@/ui'
import type { Donation } from '../types'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

interface GivingLogProps {
  donations: Donation[]
  ytdTotal: number
  onEdit: (donation: Donation) => void
}

export function GivingLog({ donations, ytdTotal, onEdit }: GivingLogProps) {
  const receiptCount = donations.filter((d) => d.receiptName).length

  return (
    <Card title="YTD Giving Log">
      {donations.length === 0 ? (
        <Typography variant="muted" className="py-4 text-center">No donations logged yet.</Typography>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center w-10">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((d) => (
                <TableRow key={d.id} className="cursor-pointer" onClick={() => onEdit(d)}>
                  <TableCell>{d.date}</TableCell>
                  <TableCell>{d.organization}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(d.amount)}</TableCell>
                  <TableCell className="text-center">
                    {d.receiptName
                      ? <Paperclip className="h-3.5 w-3.5 text-muted-foreground inline" aria-label={d.receiptName} />
                      : <span className="text-muted-foreground/40">—</span>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={1} className="font-medium">YTD Total</TableCell>
                <TableCell />
                <TableCell className="text-right tabular-nums font-medium">{fmt(ytdTotal)}</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
          <XStack justify="between">
            <Typography variant="caption">For your accountant</Typography>
            <Typography variant="small">
              YTD total: {fmt(ytdTotal)} · {receiptCount} of {donations.length} receipts attached
            </Typography>
          </XStack>
        </>
      )}
    </Card>
  )
}
