import { Card, Badge, Select, Typography, Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from '@/components/ui'
import type { MonthlyReimbursement } from '@/types'
import {
  calcOfficeReimbursement,
  calcMileageReimbursement,
  calcPhoneInternetReimbursement,
  calcHealthInsuranceReimbursement,
  calcTotalMonthlyReimbursement,
} from '@/lib/calculations'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const YEAR_OPTIONS = ['2025', '2026']

interface YearSummaryProps {
  year: number
  currentMonth: number
  getMonthData: (year: number, month: number) => MonthlyReimbursement
  onEdit: (year: number, month: number) => void
  onYearChange: (year: number) => void
}

export function YearSummary({ year, currentMonth, getMonthData, onEdit, onYearChange }: YearSummaryProps) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1
    const data = getMonthData(year, m)
    const officesTotal = data.offices.reduce((sum, o) => sum + calcOfficeReimbursement(o), 0)
    return {
      month: m,
      data,
      officesTotal,
      milesTotal: calcMileageReimbursement(data.businessMiles),
      phoneTotal: calcPhoneInternetReimbursement(data.phoneInternet),
      healthTotal: calcHealthInsuranceReimbursement(data.healthInsurance),
      total: calcTotalMonthlyReimbursement(data),
    }
  })

  const yearTotal = months.reduce((sum, m) => sum + m.total, 0)

  return (
    <Card>
      <Select
        value={String(year)}
        onValueChange={(v) => onYearChange(Number(v))}
        options={YEAR_OPTIONS.map(y => ({ value: y, label: y }))}
        className="w-24"
      />
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Month</TableHead>
            <TableHead className="w-20 text-right">Offices</TableHead>
            <TableHead className="w-16 text-right">Miles</TableHead>
            <TableHead className="w-16 text-right">Phone</TableHead>
            <TableHead className="w-16 text-right">Health</TableHead>
            <TableHead className="w-24 text-right">Total</TableHead>
            <TableHead className="w-16 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {months.map(({ month, data, officesTotal, milesTotal, phoneTotal, healthTotal, total }) => {
            const isCurrent = month === currentMonth && year === new Date().getFullYear()
            return (
              <TableRow
                key={month}
                className={`cursor-pointer ${isCurrent ? 'font-medium' : ''}`}
                onClick={() => onEdit(year, month)}
              >
                <TableCell className="pr-4">
                  {MONTH_NAMES[month - 1]}
                  {isCurrent && <Typography variant="small" as="span" className="ml-1">←</Typography>}
                </TableCell>
                <TableCell className="text-right tabular-nums">{officesTotal > 0 ? `$${officesTotal.toFixed(0)}` : '—'}</TableCell>
                <TableCell className="text-right tabular-nums">{milesTotal > 0 ? `$${milesTotal.toFixed(0)}` : '—'}</TableCell>
                <TableCell className="text-right tabular-nums">{phoneTotal > 0 ? `$${phoneTotal.toFixed(0)}` : '—'}</TableCell>
                <TableCell className="text-right tabular-nums">{healthTotal > 0 ? `$${healthTotal.toFixed(0)}` : '—'}</TableCell>
                <TableCell className="text-right tabular-nums font-medium">{total > 0 ? `$${total.toFixed(2)}` : '—'}</TableCell>
                <TableCell className="text-right">
                  {data.paid
                    ? <Badge variant="outline" className="text-xs text-green-600 border-green-600">Paid</Badge>
                    : total > 0
                      ? <Badge variant="outline" className="text-xs text-amber-500 border-amber-500">Due</Badge>
                      : null}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="pr-4 font-semibold">Total</TableCell>
            <TableCell colSpan={4} />
            <TableCell className="text-right tabular-nums font-semibold">${yearTotal.toFixed(2)}</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  )
}
