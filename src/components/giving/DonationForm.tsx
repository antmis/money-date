import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarIcon } from 'lucide-react'
import { Card, Field, Grid, Input, Label, Button, Select, Typography } from '@/components/ui'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { KNOWN_ORGS } from '@/lib/calculations'
import type { Donation } from '@/types'

const schema = z.object({
  date: z.string().min(1, 'Date required'),
  organization: z.string().min(1, 'Organization required'),
  customOrg: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
})

type FormData = z.infer<typeof schema>

interface DonationFormProps {
  onSubmit: (donation: Omit<Donation, 'id'>) => void
}

function toDateString(d: Date) {
  return d.toLocaleDateString('en-CA') // YYYY-MM-DD
}

function formatDisplay(dateStr: string) {
  if (!dateStr) return 'Pick a date'
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function DonationForm({ onSubmit }: DonationFormProps) {
  const receiptRef = useRef<File | undefined>(undefined)
  const [calOpen, setCalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      organization: '',
      customOrg: '',
      amount: NaN,
    },
  })

  const org = watch('organization')
  const dateValue = watch('date')

  function onFormSubmit(data: FormData) {
    const organization = data.organization === 'Other'
      ? (data.customOrg || 'Other')
      : data.organization
    onSubmit({
      date: data.date,
      organization,
      amount: data.amount,
      receiptName: receiptRef.current?.name,
      receiptFile: receiptRef.current,
    })
    reset()
    receiptRef.current = undefined
  }

  return (
    <Card title="Add Donation">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <Grid>
            <Field>
              <Label>Date</Label>
              <Popover open={calOpen} onOpenChange={setCalOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-muted transition-colors text-left"
                  >
                    <CalendarIcon size={14} className="text-muted-foreground shrink-0" />
                    {formatDisplay(dateValue)}
                  </button>
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
                onValueChange={(val) => setValue('organization', val)}
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
              <Input id="amount" type="number" placeholder="0" {...register('amount', { valueAsNumber: true })} />
              {errors.amount && <Typography variant="small" color="danger">{errors.amount.message}</Typography>}
            </Field>
          </Grid>

          <Field>
            <Label htmlFor="receipt">Receipt (PDF)</Label>
            <Input
              id="receipt"
              type="file"
              accept=".pdf"
              onChange={(e) => {
                receiptRef.current = e.target.files?.[0]
              }}
            />
          </Field>

          <Button type="submit">Log Donation</Button>
        </form>
    </Card>
  )
}
