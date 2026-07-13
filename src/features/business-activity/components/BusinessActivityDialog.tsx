import { useEffect, useState } from 'react'
import { CalendarIcon, Check, ChevronDown, Copy } from 'lucide-react'
import { Button, ButtonGroup, Calendar, ConfirmDeleteDialog, Dialog, Field, Grid, Input, Label, Select, Textarea, XStack, YStack, Separator, Typography } from '@/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/ui/primitives/dropdown-menu'
import { XERO_ACCOUNT_GROUPS } from '../types'
import type { BusinessActivity, BusinessActivityType, RepeatFrequency } from '../types'
import { getDuplicateDate } from '../utils/getDuplicateDate'

interface BusinessActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: Omit<BusinessActivity, 'id'>) => void
  onUpdate?: (id: string, data: Omit<BusinessActivity, 'id'>) => void
  onDelete?: (id: string) => void
  onDuplicate?: (data: Omit<BusinessActivity, 'id'>) => void
  onStopRepeating?: () => void
  onConfirm?: (id: string) => void
  seriesActive?: boolean
  entry?: BusinessActivity // present = edit mode
  initialData?: Omit<BusinessActivity, 'id'> // prefill for add mode, e.g. from duplicate
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

function dataToForm(d: Omit<BusinessActivity, 'id'>) {
  return {
    date: d.date,
    type: d.type,
    customerVendorName: d.customerVendorName,
    account: d.account,
    amount: String(d.amount),
    reimbursementDate: d.reimbursementDate,
    paymentMethod: d.paymentMethod,
    businessPurpose: d.businessPurpose,
    repeatFrequency: d.repeatFrequency,
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
  repeatFrequency: 'none' as RepeatFrequency,
})

export function BusinessActivityDialog({ open, onOpenChange, onAdd, onUpdate, onDelete, onDuplicate, onStopRepeating, onConfirm, seriesActive, entry, initialData }: BusinessActivityDialogProps) {
  const [form, setForm] = useState(entry ? dataToForm(entry) : initialData ? dataToForm(initialData) : emptyForm)
  const [dateCal, setDateCal] = useState(false)
  const [reimbCal, setReimbCal] = useState(false)

  const isEdit = !!entry
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(entry ? dataToForm(entry) : initialData ? dataToForm(initialData) : emptyForm())
    }
  }, [open, entry?.id, initialData])

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
      repeatFrequency: form.repeatFrequency,
      seriesId: entry ? entry.seriesId : null,
      confirmed: entry ? entry.confirmed : true,
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

  function handleDuplicate() {
    if (!entry || !onDuplicate) return
    onDuplicate({
      date: getDuplicateDate(entry.date),
      type: entry.type,
      customerVendorName: entry.customerVendorName,
      account: entry.account,
      amount: entry.amount,
      reimbursementDate: '',
      paymentMethod: entry.paymentMethod,
      businessPurpose: entry.businessPurpose,
      repeatFrequency: entry.repeatFrequency,
      seriesId: null,
      confirmed: true,
    })
  }

  function handleStopRepeating() {
    onStopRepeating?.()
    onOpenChange(false)
  }

  function handleConfirm() {
    if (!entry || !onConfirm) return
    onConfirm(entry.id)
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

  const isPending = entry?.confirmed === false
  const showStopRepeating = !!(onStopRepeating && entry?.seriesId && seriesActive)
  const primaryAction = isPending
    ? { label: 'Confirm', icon: Check, onClick: handleConfirm }
    : { label: 'Duplicate', icon: Copy, onClick: handleDuplicate }

  return (
    <>
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? 'Edit Activity' : 'Add Business Activity'}
      className="max-w-xl"
      footer={
        <div className={`flex gap-2 ${isEdit ? 'justify-between w-full' : 'justify-end'}`}>
          {isEdit && (
            <ButtonGroup>
              <Button variant="outline" onClick={primaryAction.onClick}>
                <primaryAction.icon />
                {primaryAction.label}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="More actions">
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {isPending && onDuplicate && (
                    <DropdownMenuItem onClick={handleDuplicate}>
                      <Copy />
                      Duplicate
                    </DropdownMenuItem>
                  )}
                  {showStopRepeating && (
                    <DropdownMenuItem onClick={handleStopRepeating}>Stop Repeating</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => setConfirmDelete(true)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          )}
          <XStack gap={2}>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!isValid}>
              {isEdit ? 'Save' : 'Add Entry'}
            </Button>
          </XStack>
        </div>
      }
    >
      <YStack gap={4}>
        {/* Customer / Vendor Name */}
        <Field>
          <Label>Customer / Vendor Name</Label>
          <Input
            placeholder="e.g. Adobe Inc."
            value={form.customerVendorName}
            onChange={e => setField('customerVendorName', e.target.value)}
          />
        </Field>

        <Grid cols={2}>
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

          {/* Account */}
          <Field>
            <Label>Account</Label>
            <Select
              value={form.account}
              onValueChange={(v) => setField('account', v)}
              placeholder="Select account"
              options={XERO_ACCOUNT_GROUPS}
            />
          </Field>
          
          {/* Date */}
          <Field>
            <Label>Date</Label>
            <Popover open={dateCal} onOpenChange={setDateCal}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="flex w-full">
                  <CalendarIcon />
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

          {/* Repeat */}
          <Field>
            <Label>Repeat</Label>
            <Select
              value={form.repeatFrequency}
              onValueChange={(v) => setField('repeatFrequency', v as RepeatFrequency)}
              options={[
                { value: 'none', label: 'Does not repeat' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'annually', label: 'Annually' },
              ]}
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

        <XStack gap={4} align="center" className="my-2">
          <Separator className="flex-1" />
          <Typography variant="muted" >Have you reimbursed this expense?</Typography>
          <Separator className="flex-1" />
        </XStack>

        <Grid cols={2}>
          {/* Payment Method */}
          <Field>
            <Label>Payment Method</Label>
            <Input
              placeholder="e.g. Chase Sapphire, Venmo"
              value={form.paymentMethod}
              onChange={e => setField('paymentMethod', e.target.value)}
            />
          </Field>

          {/* Reimbursement Date */}
          <Field>
            <Label>Reimbursement Date</Label>
            <Popover open={reimbCal} onOpenChange={setReimbCal}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="flex w-full">
                  <CalendarIcon />
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
        </Grid>
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
