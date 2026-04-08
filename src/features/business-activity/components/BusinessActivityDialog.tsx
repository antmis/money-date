import { useEffect, useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Button, Calendar, ConfirmDeleteDialog, Dialog, Field, Grid, Input, Label, Select, Textarea, XStack, YStack } from '@/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { XERO_ACCOUNTS } from '../types'
import type { BusinessActivity, BusinessActivityType } from '../types'

interface BusinessActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: Omit<BusinessActivity, 'id'>) => void
  onUpdate?: (id: string, data: Omit<BusinessActivity, 'id'>) => void
  onDelete?: (id: string) => void
  entry?: BusinessActivity // present = edit mode
}

function todayISO(): string {
  return new Date().toLocaleDateString('en-CA')
}

function formatDate(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function entryToForm(e: BusinessActivity) {
  return {
    date: e.date,
    type: e.type,
    customerVendorName: e.customerVendorName,
    account: e.account,
    amount: String(e.amount),
    reimbursementDate: e.reimbursementDate,
    paymentMethod: e.paymentMethod,
    businessPurpose: e.businessPurpose,
  }
}

const emptyForm = () => ({
  date: todayISO(),
  type: 'business_expense' as BusinessActivityType,
  customerVendorName: '',
  account: '',
  amount: '',
  reimbursementDate: '',
  paymentMethod: '',
  businessPurpose: '',
})

export function BusinessActivityDialog({ open, onOpenChange, onAdd, onUpdate, onDelete, entry }: BusinessActivityDialogProps) {
  const [form, setForm] = useState(entry ? entryToForm(entry) : emptyForm)
  const [dateCal, setDateCal] = useState(false)
  const [reimbCal, setReimbCal] = useState(false)

  const isEdit = !!entry
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(entry ? entryToForm(entry) : emptyForm())
    }
  }, [open, entry?.id])

  function setField<K extends keyof ReturnType<typeof emptyForm>>(
    key: K,
    value: ReturnType<typeof emptyForm>[K]
  ) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function buildData(): Omit<BusinessActivity, 'id'> {
    return {
      date: form.date,
      type: form.type,
      customerVendorName: form.customerVendorName.trim(),
      account: form.account,
      amount: parseFloat(form.amount) || 0,
      reimbursementDate: form.reimbursementDate,
      paymentMethod: form.paymentMethod.trim(),
      businessPurpose: form.businessPurpose.trim(),
    }
  }

  function handleSubmit() {
    if (isEdit && entry && onUpdate) {
      onUpdate(entry.id, buildData())
    } else {
      onAdd(buildData())
    }
    onOpenChange(false)
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
  }

  const isValid =
    form.date &&
    form.customerVendorName.trim().length > 0 &&
    form.account &&
    form.amount &&
    parseFloat(form.amount) > 0

  return (
    <>
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? 'Edit Entry' : 'Add Business Activity'}
      className="max-w-xl"
      footer={
        <div className={`flex gap-2 ${isEdit ? 'justify-between w-full' : 'justify-end'}`}>
          {isEdit && (
            <Button variant="destructive" onClick={() => setConfirmDelete(true)}>Delete</Button>
          )}
          <XStack gap={2}>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!isValid}>{isEdit ? 'Save' : 'Add Entry'}</Button>
          </XStack>
        </div>
      }
    >
      <YStack gap={4}>
        <Grid cols={2} className="gap-3">
          {/* Date */}
          <Field>
            <Label>Date</Label>
            <Popover open={dateCal} onOpenChange={setDateCal}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="flex w-full justify-start gap-2">
                  <CalendarIcon className="size-4" />
                  {form.date ? formatDate(form.date) : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.date ? new Date(form.date + 'T12:00:00') : undefined}
                  defaultMonth={form.date ? new Date(form.date + 'T12:00:00') : new Date()}
                  onSelect={(d) => {
                    if (d) {
                      setField('date', d.toLocaleDateString('en-CA'))
                      setDateCal(false)
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </Field>

          {/* Type */}
          <Field>
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) => setField('type', v as BusinessActivityType)}
              options={[
                { value: 'business_expense', label: 'Business Expense' },
                { value: 'business_income', label: 'Business Income' },
              ]}
            />
          </Field>

          {/* Customer / Vendor Name */}
          <Field>
            <Label>Customer / Vendor Name</Label>
            <Input
              placeholder="e.g. Adobe Inc."
              value={form.customerVendorName}
              onChange={e => setField('customerVendorName', e.target.value)}
            />
          </Field>

          {/* Account */}
          <Field>
            <Label>Account</Label>
            <Select
              value={form.account}
              onValueChange={(v) => setField('account', v)}
              placeholder="Select account"
              options={XERO_ACCOUNTS.map(a => ({ value: a, label: a }))}
            />
          </Field>

          {/* Amount */}
          <Field>
            <Label>Amount</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              prefix="$"
              value={form.amount}
              onChange={e => setField('amount', e.target.value)}
            />
          </Field>

          {/* Reimbursement Date */}
          <Field>
            <Label>Reimbursement Date</Label>
            <Popover open={reimbCal} onOpenChange={setReimbCal}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="flex w-full justify-start gap-2">
                  <CalendarIcon className="size-4" />
                  {form.reimbursementDate ? formatDate(form.reimbursementDate) : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.reimbursementDate ? new Date(form.reimbursementDate + 'T12:00:00') : undefined}
                  defaultMonth={new Date()}
                  onSelect={(d) => {
                    if (d) {
                      setField('reimbursementDate', d.toLocaleDateString('en-CA'))
                      setReimbCal(false)
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </Field>

          {/* Payment Method */}
          <Field className="col-span-2">
            <Label>Payment Method</Label>
            <Input
              placeholder="e.g. Chase Sapphire, Venmo"
              value={form.paymentMethod}
              onChange={e => setField('paymentMethod', e.target.value)}
            />
          </Field>
        </Grid>

        {/* Business Purpose */}
        <Field>
          <Label>Business Purpose</Label>
          <Textarea
            placeholder="Describe the business purpose of this transaction..."
            value={form.businessPurpose}
            onChange={e => setField('businessPurpose', e.target.value)}
            rows={3}
          />
        </Field>
      </YStack>
    </Dialog>

    <ConfirmDeleteDialog
      open={confirmDelete}
      onOpenChange={setConfirmDelete}
      onConfirm={() => { onDelete?.(entry!.id); onOpenChange(false) }}
      description="This entry will be permanently removed."
    />
    </>
  )
}
