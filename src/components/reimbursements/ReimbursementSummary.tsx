import { useState } from 'react'
import { Card, Button, Field, Grid, Input, Label, LineItem, Separator, Badge, Typography } from '@/components/ui'
import type { MonthlyReimbursement } from '@/types'
import {
  calcOfficeReimbursement,
  calcMileageReimbursement,
  calcPhoneInternetReimbursement,
  calcHealthInsuranceReimbursement,
  calcTotalMonthlyReimbursement,
} from '@/lib/calculations'

interface ReimbursementSummaryProps {
  data: MonthlyReimbursement
  onMarkPaid: (paymentMethod: string, paidDate: string) => void
  onMarkUnpaid: () => void
}

export function ReimbursementSummary({ data, onMarkPaid, onMarkUnpaid }: ReimbursementSummaryProps) {
  const [paymentMethod, setPaymentMethod] = useState(data.paymentMethod)
  const [paidDate, setPaidDate] = useState(data.paidDate)

  const officesTotal = data.offices.reduce((sum, o) => sum + calcOfficeReimbursement(o), 0)
  const mileageTotal = calcMileageReimbursement(data.businessMiles)
  const phoneTotal = calcPhoneInternetReimbursement(data.phoneInternet)
  const healthTotal = calcHealthInsuranceReimbursement(data.healthInsurance)
  const grandTotal = calcTotalMonthlyReimbursement(data)

  function handleMarkPaid() {
    onMarkPaid(paymentMethod, paidDate)
  }

  return (
    <Card
      title="Summary"
      headerExtra={
        data.paid
          ? <Badge variant="outline" className="text-green-600 border-green-600">Paid</Badge>
          : undefined
      }
    >
      <div className="space-y-1">
        {data.offices.map((o, i) => (
          <LineItem
            key={o.templateId + i}
            label={o.name || `Office ${i + 1}`}
            value={`$${calcOfficeReimbursement(o).toFixed(2)}`}
          />
        ))}
        {data.offices.length === 0 && (
          <LineItem label="Offices" value="$0.00" />
        )}
        <LineItem label="Mileage" value={`$${mileageTotal.toFixed(2)}`} />
        <LineItem label="Phone & Internet" value={`$${phoneTotal.toFixed(2)}`} />
        <LineItem label="Health Insurance" value={`$${healthTotal.toFixed(2)}`} />
      </div>

      <Separator />

      <LineItem label="Total Transfer" value={<Typography variant="amountLg">${grandTotal.toFixed(2)}</Typography>} />

      <Separator />

      {data.paid ? (
        <div className="space-y-2">
          <LineItem label="Payment method" value={data.paymentMethod || '—'} />
          <LineItem label="Date paid" value={data.paidDate || '—'} />
          <Button variant="outline" size="sm" className="w-full mt-2" onClick={onMarkUnpaid}>
            Mark as unpaid
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Grid cols={2} className="gap-3">
            <Field>
              <Label htmlFor="payment-method">Payment method</Label>
              <Input
                id="payment-method"
                placeholder="e.g. ACH transfer"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="paid-date">Date</Label>
              <Input
                id="paid-date"
                type="date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
              />
            </Field>
          </Grid>
          <Button className="w-full" onClick={handleMarkPaid} disabled={grandTotal === 0}>
            Mark as paid
          </Button>
        </div>
      )}
    </Card>
  )
}
