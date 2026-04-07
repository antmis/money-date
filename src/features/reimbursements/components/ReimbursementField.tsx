import { Field, Input, Label, ListItem, XStack } from '@/ui'

interface ReimbursementFieldProps {
  id: string
  label: string
  value: number
  reimbursement: number
  onChange: (value: number) => void
  prefix?: string
  step?: string
  placeholder?: string
}

export function ReimbursementField({
  id,
  label,
  value,
  reimbursement,
  onChange,
  prefix,
  step = '0.01',
  placeholder = '0.00',
}: ReimbursementFieldProps) {
  return (
    <XStack gap={4} className="w-full items-end">
      <Field className="flex-1">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          type="number"
          min="0"
          step={step}
          placeholder={placeholder}
          prefix={prefix}
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
      </Field>
      <ListItem
        title="Reimburse"
        subTitle={`$${reimbursement.toFixed(2)}`}
        size="sm"
        variant="ghost"
        className="w-auto min-h-0 shrink-0 p-0 justify-end"
      />
    </XStack>
  )
}
