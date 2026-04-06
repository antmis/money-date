import { useState } from 'react'
import { Card, Button, Field, Input, Label, Separator, Badge, Typography } from '@/components/ui'
import type { MonthlyReimbursement } from '@/types'
import {
  calcOfficeReimbursement,
  calcMileageReimbursement,
  calcPhoneInternetReimbursement,
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

  const homeOfficeTotal = calcOfficeReimbursement(data.homeOffice)
  const recStudioTotal = calcOfficeReimbursement(data.recordingStudio)
  const mileageTotal = calcMileageReimbursement(data.businessMiles)
  const phoneTotal = calcPhoneInternetReimbursement(data.phoneInternet)
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
      <div className="space-y-2">
        <div className="flex justify-between">
          <Typography variant="muted" as="span">Home Office</Typography>
          <Typography variant="label" as="span" numeric>${homeOfficeTotal.toFixed(2)}</Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="muted" as="span">Recording Studio</Typography>
          <Typography variant="label" as="span" numeric>${recStudioTotal.toFixed(2)}</Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="muted" as="span">Mileage</Typography>
          <Typography variant="label" as="span" numeric>${mileageTotal.toFixed(2)}</Typography>
        </div>
        <div className="flex justify-between">
          <Typography variant="muted" as="span">Phone & Internet</Typography>
          <Typography variant="label" as="span" numeric>${phoneTotal.toFixed(2)}</Typography>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <Typography variant="label" as="span">Total Transfer</Typography>
        <Typography variant="amountLg">${grandTotal.toFixed(2)}</Typography>
      </div>

      <Separator />

      {data.paid ? (
        <div className="space-y-2">
          <div className="flex justify-between">
            <Typography variant="muted" as="span">Payment method</Typography>
            <Typography variant="body" as="span">{data.paymentMethod || '—'}</Typography>
          </div>
          <div className="flex justify-between">
            <Typography variant="muted" as="span">Date paid</Typography>
            <Typography variant="body" as="span">{data.paidDate || '—'}</Typography>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2" onClick={onMarkUnpaid}>
            Mark as unpaid
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
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
          </div>
          <Button className="w-full" onClick={handleMarkPaid} disabled={grandTotal === 0}>
            Mark as paid
          </Button>
        </div>
      )}
    </Card>
  )
}
