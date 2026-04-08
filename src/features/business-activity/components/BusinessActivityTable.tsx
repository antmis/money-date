import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from '@/ui'
import type { BusinessActivity } from '../types'

interface BusinessActivityTableProps {
  entries: BusinessActivity[]
  onEdit: (entry: BusinessActivity) => void
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function BusinessActivityTable({ entries, onEdit }: BusinessActivityTableProps) {
  return (
    <Card title="Business Activity Log">
      {entries.length === 0 ? (
        <Typography variant="muted" className="py-4 text-center">No entries yet. Click "+ Add Entry" to get started.</Typography>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Customer / Vendor</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Reimb. Date</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map(entry => (
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
                <TableCell className="whitespace-nowrap">{formatDate(entry.reimbursementDate)}</TableCell>
                <TableCell className="max-w-[140px] truncate" title={entry.paymentMethod}>
                  {entry.paymentMethod || '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}
