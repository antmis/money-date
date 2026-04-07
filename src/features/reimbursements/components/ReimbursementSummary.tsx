import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Card, Calendar, Button, Field, Input, Label, Badge, Typography, ListItem, ListGroup, XStack, YStack } from '@/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import type { MonthlyReimbursement } from '../types'
import {
  calcOfficeReimbursement,
  calcMileageReimbursement,
  calcPhoneInternetReimbursement,
  calcHealthInsuranceReimbursement,
  calcTotalMonthlyReimbursement,
} from '../utils/calculations'

interface ReimbursementSummaryProps {
  data: MonthlyReimbursement
  onMarkPaid: (paymentMethod: string, paidDate: string) => void
  onMarkUnpaid: () => void
}

export function ReimbursementSummary({ data, onMarkPaid, onMarkUnpaid }: ReimbursementSummaryProps) {
  const [paymentMethod, setPaymentMethod] = useState(data.paymentMethod)
  const [paidDate, setPaidDate] = useState(data.paidDate)
  const [calOpen, setCalOpen] = useState(false)

  const mileageTotal = calcMileageReimbursement(data.businessMiles)
  const phoneTotal = calcPhoneInternetReimbursement(data.phoneInternet)
  const healthTotal = calcHealthInsuranceReimbursement(data.healthInsurance)
  const grandTotal = calcTotalMonthlyReimbursement(data)

  function handleMarkPaid() {
    onMarkPaid(paymentMethod, paidDate)
  }

  const footerNode = (
    <YStack>
      <ListItem title="Total Transfer" lineItem={<Typography variant="amountLg">${grandTotal.toFixed(2)}</Typography>} />
      {data.paid ? (
        <YStack gap={2}>
          <ListGroup>
            <ListItem title="Payment method" lineItem={data.paymentMethod || '—'} />
            <ListItem title="Date paid" lineItem={data.paidDate || '—'} />
          </ListGroup>
          <Button variant="outline" size="sm" onClick={onMarkUnpaid}>
            Mark as unpaid
          </Button>
        </YStack>
      ) : (
        <YStack gap={4}>
          <XStack gap={2}>
            <Field className="flex-1">
              <Label htmlFor="payment-method">Payment method</Label>
              <Input
                id="payment-method"
                placeholder="e.g. ACH transfer"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </Field>
            <Field className="flex-1">
              <Label htmlFor="paid-date">Date</Label>
              <Popover open={calOpen} onOpenChange={setCalOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="paid-date"
                    type="button"
                    className="flex w-full justify-start gap-2"
                    variant="outline"
                  >
                    <CalendarIcon className="size-4" />
                    {paidDate
                      ? new Date(paidDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={paidDate ? new Date(paidDate + 'T12:00:00') : undefined}
                    onSelect={(d) => {
                      if (d) {
                        setPaidDate(d.toLocaleDateString('en-CA'))
                        setCalOpen(false)
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
          </XStack>
          <Button size="sm" onClick={handleMarkPaid} disabled={grandTotal === 0}>
            Mark as paid
          </Button>
        </YStack>
      )}
    </YStack>
  )

  return (
    <Card
      title="Summary"
      headerExtra={
        data.paid
          ? <Badge variant="outline" className="text-green-600 border-green-600">Paid</Badge>
          : undefined
      }
      footer={footerNode}
    >
      <ListGroup>
        {data.offices.map((o, i) => (
          <ListItem
            key={o.templateId + i}
            title={o.name || `Office ${i + 1}`}
            lineItem={`$${calcOfficeReimbursement(o).toFixed(2)}`}
          />
        ))}
        {data.offices.length === 0 && (
          <ListItem title="Offices" lineItem="$0.00" />
        )}
        <ListItem title="Mileage" lineItem={`$${mileageTotal.toFixed(2)}`} />
        <ListItem title="Phone & Internet" lineItem={`$${phoneTotal.toFixed(2)}`} />
        <ListItem title="Health Insurance" lineItem={`$${healthTotal.toFixed(2)}`} />
      </ListGroup>
    </Card>
  )
}
