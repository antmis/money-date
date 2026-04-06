import { Card, Badge, Typography } from '@/components/ui'
import type { MonthlyReimbursement } from '@/types'
import {
  calcOfficeReimbursement,
  calcMileageReimbursement,
  calcPhoneInternetReimbursement,
  calcTotalMonthlyReimbursement,
} from '@/lib/calculations'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface YearSummaryProps {
  year: number
  currentMonth: number
  getMonthData: (year: number, month: number) => MonthlyReimbursement
  onEdit: (year: number, month: number) => void
}

export function YearSummary({ year, currentMonth, getMonthData, onEdit }: YearSummaryProps) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1
    const data = getMonthData(year, m)
    return {
      month: m,
      data,
      homeTotal: calcOfficeReimbursement(data.homeOffice),
      studioTotal: calcOfficeReimbursement(data.recordingStudio),
      milesTotal: calcMileageReimbursement(data.businessMiles),
      phoneTotal: calcPhoneInternetReimbursement(data.phoneInternet),
      total: calcTotalMonthlyReimbursement(data),
    }
  })

  const yearTotal = months.reduce((sum, m) => sum + m.total, 0)

  return (
    <Card title={year}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th className="text-left py-2 pr-4 font-medium">Month</th>
              <th className="text-right py-2 px-2 font-medium">Home</th>
              <th className="text-right py-2 px-2 font-medium">Studio</th>
              <th className="text-right py-2 px-2 font-medium">Miles</th>
              <th className="text-right py-2 px-2 font-medium">Phone</th>
              <th className="text-right py-2 pl-4 font-medium">Total</th>
              <th className="text-right py-2 pl-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {months.map(({ month, data, homeTotal, studioTotal, milesTotal, phoneTotal, total }) => {
              const isCurrent = month === currentMonth
              return (
                <tr
                  key={month}
                  className={`border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${isCurrent ? 'font-medium' : ''}`}
                  onClick={() => onEdit(year, month)}
                >
                  <td className="py-2 pr-4">
                    {MONTH_NAMES[month - 1]}
                    {isCurrent && <Typography variant="small" as="span" className="ml-1">←</Typography>}
                  </td>
                  <td className="text-right py-2 px-2 tabular-nums">{homeTotal > 0 ? `$${homeTotal.toFixed(0)}` : '—'}</td>
                  <td className="text-right py-2 px-2 tabular-nums">{studioTotal > 0 ? `$${studioTotal.toFixed(0)}` : '—'}</td>
                  <td className="text-right py-2 px-2 tabular-nums">{milesTotal > 0 ? `$${milesTotal.toFixed(0)}` : '—'}</td>
                  <td className="text-right py-2 px-2 tabular-nums">{phoneTotal > 0 ? `$${phoneTotal.toFixed(0)}` : '—'}</td>
                  <td className="text-right py-2 pl-4 tabular-nums font-medium">{total > 0 ? `$${total.toFixed(2)}` : '—'}</td>
                  <td className="text-right py-2 pl-2">
                    {data.paid
                      ? <Badge variant="outline" className="text-xs text-green-600 border-green-600">Paid</Badge>
                      : total > 0
                        ? <Badge variant="outline" className="text-xs text-amber-500 border-amber-500">Due</Badge>
                        : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t font-semibold">
              <td className="py-2 pr-4">Total</td>
              <td colSpan={4} />
              <td className="text-right py-2 pl-4 tabular-nums">${yearTotal.toFixed(2)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  )
}
