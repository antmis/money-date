import { Select, XStack } from '@/ui'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const monthOptions = MONTHS.map((name, i) => ({ value: String(i + 1), label: name }))

interface MonthSelectorProps {
  year: number
  month: number
  onChange: (year: number, month: number) => void
}

export function MonthSelector({ year, month, onChange }: MonthSelectorProps) {
  const currentYear = new Date().getFullYear()
  const years = [currentYear - 1, currentYear, currentYear + 1]

  return (
    <XStack gap={2} align="center">
      <Select
        value={String(month)}
        onValueChange={(v) => onChange(year, Number(v))}
        options={monthOptions}
        className="w-40"
      />

      <Select
        value={String(year)}
        onValueChange={(v) => onChange(Number(v), month)}
        options={years.map(String)}
        className="w-28"
      />
    </XStack>
  )
}
