import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from '@/ui'
import type { BusinessActivity } from '../types'
import { formatDate } from '@/shared/utils/formatDate'

interface BusinessActivityTableProps {
  entries: BusinessActivity[]
  onEdit: (entry: BusinessActivity) => void
}

export function BusinessActivityTable({ entries, onEdit }: BusinessActivityTableProps) {
  const [sortAsc, setSortAsc] = useState(false)

  const sorted = [...entries].sort((a, b) => {
    const cmp = a.date.localeCompare(b.date)
    return sortAsc ? cmp : -cmp
  })

  const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0)

  return (
    <Card title="Business Activity Log">
      {entries.length === 0 ? (
        <Typography variant="muted" className="py-4 text-center">No entries yet. Click "+ Add Entry" to get started.</Typography>
      ) : (
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
              <TableHead>Type</TableHead>
              <TableHead>Customer / Vendor</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Reimbursed?</TableHead>
              <TableHead>Purpose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(entry => (
              <TableRow key={entry.id} className="cursor-pointer" onClick={() => onEdit(entry)}>
                <TableCell className="whitespace-nowrap">{formatDate(entry.date)}</TableCell>
                <TableCell>
                  <Badge variant={entry.type === 'business_expense' ? 'default' : 'secondary'}>
                    {entry.type === 'business_expense' ? 'Expense' : 'Income'}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[180px] truncate" title={entry.customerVendorName}>
                  {entry.customerVendorName || '—'}
                </TableCell>
                <TableCell className="max-w-[160px] truncate" title={entry.account}>
                  {entry.account || '—'}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  ${entry.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  {!entry.reimbursementDate && (
                    <Badge variant="secondary">
                      <Check />
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {entry.businessPurpose && (
                    <Badge variant="secondary">
                      <Check />
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
          <TableRow>
            <TableCell className="pr-4 font-semibold">Total</TableCell>
            <TableCell colSpan={3} />
            <TableCell className="text-right tabular-nums font-semibold">${totalAmount.toFixed(2)}</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
        </Table>
      )}
    </Card>
  )
}
