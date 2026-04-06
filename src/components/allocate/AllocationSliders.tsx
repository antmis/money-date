import { Card, Field, Slider, Label, Separator, Typography } from '@/components/ui'
import type { AllocationRates } from '@/types'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

interface AllocationSlidersProps {
  rates: AllocationRates
  onRatesChange: (r: AllocationRates) => void
  goalsAmount: number
}

const sliderConfig = [
  { key: 'taxReserve' as keyof AllocationRates, label: 'Tax Reserve', min: 25, max: 35 },
  { key: 'sepIra' as keyof AllocationRates, label: 'SEP IRA', min: 0, max: 20 },
  { key: 'giving' as keyof AllocationRates, label: 'Giving', min: 0, max: 25 },
]

export function AllocationSliders({ rates, onRatesChange, goalsAmount }: AllocationSlidersProps) {
  return (
    <Card title="Allocation Rates">
      <div className="space-y-4">
        {sliderConfig.map(({ key, label, min, max }) => (
          <Field key={key}>
            <div className="flex justify-between items-center">
              <Label>{label}</Label>
              <Typography variant="label" numeric>{rates[key]}%</Typography>
            </div>
            <Slider
              min={min}
              max={max}
              step={1}
              value={[rates[key]]}
              onValueChange={([val]) => onRatesChange({ ...rates, [key]: val })}
              className="w-full"
            />
            <Typography variant="small" as="div" className="flex justify-between">
              <span>{min}%</span>
              <span>{max}%</span>
            </Typography>
          </Field>
        ))}

        <Separator />

        <div className="flex items-center justify-between py-1">
          <div>
            <Typography variant="label">Goals</Typography>
            <Typography variant="small">Set in Goals tab</Typography>
          </div>
          <Typography variant="amount" color="goals">
            {fmt(goalsAmount)} / quarter
          </Typography>
        </div>
      </div>
    </Card>
  )
}
