import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Card, Calendar, Button, Dialog, Field, Input, Label, Badge, Typography, ListItem, ListGroup, XStack, YStack } from '@/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import type { MonthlyReimbursement } from '../types'
import { formatDate } from '@/shared/utils/formatDate'
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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(data.paymentMethod)
  const [paidDate, setPaidDate] = useState(data.paidDate)
  const [calOpen, setCalOpen] = useState(false)

  const mileageTotal = calcMileageReimbursement(data.businessMiles)
  const phoneTotal = calcPhoneInternetReimbursement(data.phoneInternet)
  const healthTotal = calcHealthInsuranceReimbursement(data.healthInsurance)
  const grandTotal = calcTotalMonthlyReimbursement(data)

  function openDialog() {
    setPaymentMethod(data.paymentMethod)
    setPaidDate(data.paidDate)
    setDialogOpen(true)
  }

  function handleSave() {
    onMarkPaid(paymentMethod, paidDate)
    setDialogOpen(false)
  }

  const footerNode = (
    <YStack>
      <ListItem title="Total Transfer" lineItem={<Typography variant="amountLg" className="text-primary-foreground">${grandTotal.toFixed(2)}</Typography>} />
      {data.paid ? (
        <YStack gap={2}>
          <ListGroup>
            <ListItem title="Payment method" lineItem={data.paymentMethod || '—'} />
            <ListItem title="Date paid" lineItem={data.paidDate || '—'} />
          </ListGroup>
          <Button variant="outline" onClick={onMarkUnpaid}>
            Mark as unpaid
          </Button>
        </YStack>
      ) : (
        <Button variant="outline" onClick={openDialog} disabled={grandTotal === 0}>
          Mark as Reimbursed
        </Button>
      )}
    </YStack>
  )

  return (
    <>
      <Card
        title="Summary"
        headerExtra={
          data.paid
            ? <Badge>Paid</Badge>
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

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => { if (!open) setDialogOpen(false) }}
        title="Mark as Reimbursed"
        className="max-w-md"
        footer={
          <XStack justify="end" gap={2}>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Mark as Reimbursed</Button>
          </XStack>
        }
      >
        <YStack gap={4}>
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
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="paid-date"
                  type="button"
                  className="flex w-full justify"
                  variant="outline"
                >
                  <CalendarIcon />
                  {paidDate ? formatDate(paidDate) : 'Pick a date'}
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
        </YStack>
      </Dialog>
    </>
  )
}
