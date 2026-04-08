import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarIcon } from 'lucide-react'
import { ConfirmDeleteDialog, Dialog, Field, Input, Label, Button, Select, Typography, Calendar, XStack, YStack } from '@/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { KNOWN_ORGS } from '../utils/constants'
import type { Donation } from '../types'

const schema = z.object({
  date: z.string().min(1, 'Date required'),
  organization: z.string().min(1, 'Organization required'),
  customOrg: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
})

type FormData = z.infer<typeof schema>

interface DonationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (donation: Omit<Donation, 'id'>) => void
  onUpdate?: (id: string, data: Omit<Donation, 'id'>) => void
  onDelete?: (id: string) => void
  donation?: Donation // present = edit mode
}

function toDateString(d: Date) {
  return d.toLocaleDateString('en-CA')
}

function formatDisplay(dateStr: string) {
  if (!dateStr) return 'Pick a date'
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function defaultsFromDonation(donation: Donation): FormData {
  const isCustom = !KNOWN_ORGS.includes(donation.organization as typeof KNOWN_ORGS[number])
  return {
    date: donation.date,
    organization: isCustom ? 'Other' : donation.organization,
    customOrg: isCustom ? donation.organization : '',
    amount: donation.amount,
  }
}

export function DonationForm({ open, onOpenChange, onSubmit, onUpdate, onDelete, donation }: DonationFormProps) {
  const receiptRef = useRef<File | undefined>(undefined)
  const [calOpen, setCalOpen] = useState(false)
  const isEdit = !!donation
  const [confirmDelete, setConfirmDelete] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: donation
      ? defaultsFromDonation(donation)
      : { date: new Date().toISOString().split('T')[0], organization: '', customOrg: '', amount: NaN },
  })

  useEffect(() => {
    if (open) {
      if (donation) {
        reset(defaultsFromDonation(donation))
      } else {
        reset({ date: new Date().toISOString().split('T')[0], organization: '', customOrg: '', amount: NaN })
      }
      receiptRef.current = undefined
    }
  }, [open, donation?.id])

  const org = watch('organization')
  const dateValue = watch('date')

  function onFormSubmit(data: FormData) {
    const organization = data.organization === 'Other'
      ? (data.customOrg || 'Other')
      : data.organization
    const payload = {
      date: data.date,
      organization,
      amount: data.amount,
      receiptName: receiptRef.current?.name ?? donation?.receiptName,
      receiptFile: receiptRef.current ?? donation?.receiptFile,
    }
    if (isEdit && donation && onUpdate) {
      onUpdate(donation.id, payload)
    } else {
      onSubmit(payload)
    }
    onOpenChange(false)
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      reset()
      receiptRef.current = undefined
    }
    onOpenChange(next)
  }

  return (
    <>
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? `Edit: ${donation.organization}` : 'Log Donation'}
      className="max-w-md"
      footer={
        <div className={`flex gap-2 ${isEdit ? 'justify-between w-full' : 'justify-end'}`}>
          {isEdit && (
            <Button variant="destructive" onClick={() => setConfirmDelete(true)}>Delete</Button>
          )}
          <XStack gap={2}>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" form="donation-form">{isEdit ? 'Save' : 'Log Donation'}</Button>
          </XStack>
        </div>
      }
    >
      <form id="donation-form" onSubmit={handleSubmit(onFormSubmit)}>
        <YStack gap={4}>
          <Field>
            <Label>Date</Label>
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  className="flex w-full"
                  variant="outline"
                >
                  <CalendarIcon />
                  {formatDisplay(dateValue)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateValue ? new Date(dateValue + 'T12:00:00') : undefined}
                  onSelect={(d) => {
                    if (d) {
                      setValue('date', toDateString(d), { shouldValidate: true })
                      setCalOpen(false)
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors.date && <Typography variant="small" color="danger">{errors.date.message}</Typography>}
          </Field>
          <Field>
            <Label>Organization</Label>
            <Select
              value={watch('organization')}
              onValueChange={(val) => setValue('organization', val, { shouldValidate: true })}
              options={[...KNOWN_ORGS]}
              placeholder="Select org"
            />
            {org === 'Other' && (
              <Input placeholder="Organization name" {...register('customOrg')} />
            )}
            {errors.organization && <Typography variant="small" color="danger">{errors.organization.message}</Typography>}
          </Field>
          <Field>
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" placeholder="0" prefix="$" {...register('amount', { valueAsNumber: true })} />
            {errors.amount && <Typography variant="small" color="danger">{errors.amount.message}</Typography>}
          </Field>
          <Field>
            <Label htmlFor="receipt">Receipt (PDF)</Label>
            <Input
              id="receipt"
              type="file"
              accept=".pdf"
              onChange={(e) => { receiptRef.current = e.target.files?.[0] }}
            />
            {isEdit && donation?.receiptName && !receiptRef.current && (
              <Typography variant="small" color="muted">Current: {donation.receiptName}</Typography>
            )}
          </Field>
        </YStack>
      </form>
    </Dialog>

    <ConfirmDeleteDialog
      open={confirmDelete}
      onOpenChange={setConfirmDelete}
      onConfirm={() => { onDelete?.(donation!.id); onOpenChange(false) }}
      description="This donation will be permanently removed."
    />
    </>
  )
}
