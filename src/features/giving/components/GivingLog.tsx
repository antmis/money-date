import { Paperclip , ChevronsUpDown} from 'lucide-react'
import { Card, Typography, Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, XStack, ExportCSVButton } from '@/ui'
import type { CsvColumn } from '@/ui'
import type { Donation } from '../types'
import { formatDate } from '@/shared/utils/formatDate'
import { useState } from 'react'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const CSV_COLUMNS: CsvColumn<Donation>[] = [
  { header: 'Date', accessor: d => d.date },
  { header: 'Organization', accessor: d => d.organization },
  { header: 'Amount', accessor: d => d.amount },
  { header: 'Receipt', accessor: d => d.receiptName ?? '' },
]

interface GivingLogProps {
  donations: Donation[]
  ytdTotal: number
  onEdit: (donation: Donation) => void
}

export function GivingLog({ donations, ytdTotal, onEdit }: GivingLogProps) {
  const receiptCount = donations.filter((d) => d.receiptName).length
  const [sortAsc, setSortAsc] = useState(false)

  const sorted = [...donations].sort((a, b) => {
    const cmp = a.date.localeCompare(b.date)
    return sortAsc ? cmp : -cmp
  })
  

  return (
    <Card title="YTD Giving Log">
      {donations.length === 0 ? (
        <Typography variant="muted" className="py-4 text-center w-full">No donations logged yet.</Typography>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                <button
                  onClick={() => setSortAsc(a => !a)}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Date <ChevronsUpDown size={14} />
                </button>
              </TableHead>
                <TableHead>Organization</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center w-10">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((d) => (
                <TableRow key={d.id} className="cursor-pointer" onClick={() => onEdit(d)}>
                  <TableCell>{formatDate(d.date)}</TableCell>
                  <TableCell>{d.organization}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(d.amount)}</TableCell>
                  <TableCell className="text-center">
                    {d.receiptName
                      ? <Paperclip aria-label={d.receiptName} size={14}/>
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
              Total: {fmt(ytdTotal)} · {receiptCount} of {donations.length} receipts attached
            </Typography>
          </XStack>
          <XStack justify="end">
            <ExportCSVButton data={donations} columns={CSV_COLUMNS} filename="giving-log" />
          </XStack>
        </>
      )}
    </Card>
  )
}
