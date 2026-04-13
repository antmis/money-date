import { Card, Badge, Select, Typography, Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, ExportCSVButton, XStack } from '@/ui'
import type { CsvColumn } from '@/ui'
import type { MonthlyReimbursement } from '../types'
import {
  calcOfficeReimbursement,
  calcMileageReimbursement,
  calcPhoneInternetReimbursement,
  calcHealthInsuranceReimbursement,
  calcTotalMonthlyReimbursement,
} from '../utils/calculations'



const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface MonthRow {
  month: number
  data: MonthlyReimbursement
  officesTotal: number
  milesTotal: number
  phoneTotal: number
  healthTotal: number
  total: number
}

const CSV_COLUMNS: CsvColumn<MonthRow>[] = [
  { header: 'Month', accessor: r => MONTH_NAMES[r.month - 1] },
  { header: 'Office', accessor: r => r.officesTotal.toFixed(2) },
  { header: 'Miles', accessor: r => r.milesTotal.toFixed(2) },
  { header: 'Phone', accessor: r => r.phoneTotal.toFixed(2) },
  { header: 'Health', accessor: r => r.healthTotal.toFixed(2) },
  { header: 'Total', accessor: r => r.total.toFixed(2) },
  { header: 'Status', accessor: r => r.data.paid ? 'Paid' : r.total > 0 ? 'Due' : '' },
]

const YEAR_OPTIONS = ['2025', '2026']

interface YearSummaryProps {
  year: number
  currentMonth: number
  yearData: MonthlyReimbursement[]
  onEdit: (year: number, month: number) => void
  onYearChange: (year: number) => void
}

function emptyMonth(year: number, month: number): MonthlyReimbursement {
  return {
    year, month, offices: [], businessMiles: 0,
    phoneInternet: { internet: 0, phone: 0, internetUsage: 50, phoneUsage: 50 },
    healthInsurance: { health: 0, dental: 0, vision: 0 },
    paid: false, paymentMethod: '', paidDate: '',
  }
}

export function YearSummary({ year, currentMonth, yearData, onEdit, onYearChange }: YearSummaryProps) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1
    const data = yearData.find(r => r.year === year && r.month === m) ?? emptyMonth(year, m)
    const ct = data.computedTotals
    const officesTotal = ct?.officesTotal ?? data.offices.reduce((sum, o) => sum + calcOfficeReimbursement(o), 0)
    const milesTotal = ct?.milesTotal ?? calcMileageReimbursement(data.businessMiles)
    const phoneTotal = ct?.phoneTotal ?? calcPhoneInternetReimbursement(data.phoneInternet)
    const healthTotal = ct?.healthTotal ?? calcHealthInsuranceReimbursement(data.healthInsurance)
    const total = ct?.total ?? calcTotalMonthlyReimbursement(data)
    return { month: m, data, officesTotal, milesTotal, phoneTotal, healthTotal, total }
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
            <TableHead className="w-20 text-right">Office</TableHead>
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
                    ? <Badge >Paid</Badge>
                    : total > 0
                      ? <Badge variant="destructive">Due</Badge>
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
      <XStack justify="end">
        <ExportCSVButton data={months} columns={CSV_COLUMNS} filename={`reimbursements-${year}`} />
      </XStack>
    </Card>
  )
}
