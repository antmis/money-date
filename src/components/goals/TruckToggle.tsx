import { Card, Field, Input, Label, Typography } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { TruckMode } from '@/types'

interface TruckToggleProps {
  mode: TruckMode
  onModeChange: (mode: TruckMode) => void
  payoffBalance: number
  payoffYTD: number
  modFundBalance: number
  modYTD: number
  quarterlyAmount: number
  onPayoffBalanceChange: (n: number) => void
  onPayoffYTDChange: (n: number) => void
  onModBalanceChange: (n: number) => void
  onModYTDChange: (n: number) => void
  onAmountChange: (n: number) => void
}

export function TruckToggle({
  mode,
  onModeChange,
  payoffBalance,
  payoffYTD,
  modFundBalance,
  modYTD,
  quarterlyAmount,
  onPayoffBalanceChange,
  onPayoffYTDChange,
  onModBalanceChange,
  onModYTDChange,
  onAmountChange,
}: TruckToggleProps) {
  return (
    <Card
      title="Truck"
      headerExtra={
        <div className="flex rounded-md border overflow-hidden">
          {(['payoff', 'mods'] as TruckMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={cn(
                'px-3 py-1.5 text-sm capitalize transition-colors',
                mode === m
                  ? 'bg-foreground text-background'
                  : 'bg-background text-muted-foreground hover:text-foreground'
              )}
            >
              {m}
            </button>
          ))}
        </div>
      }
    >
      <Typography variant="muted" as="div">
        This quarter:{' '}
        <Typography variant="label" as="span" color="foreground" className="capitalize">{mode}</Typography>
      </Typography>

      <Field>
        <Label>Quarterly Amount</Label>
        <Input
          type="number"
          value={quarterlyAmount || ''}
          onChange={(e) => onAmountChange(Number(e.target.value) || 0)}
          className="max-w-48"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Typography variant="label">Payoff</Typography>
          <Field>
            <Label>Remaining Balance</Label>
            <Input
              type="number"
              value={payoffBalance || ''}
              onChange={(e) => onPayoffBalanceChange(Number(e.target.value) || 0)}
            />
          </Field>
          <Field>
            <Label>Applied YTD</Label>
            <Input
              type="number"
              value={payoffYTD || ''}
              onChange={(e) => onPayoffYTDChange(Number(e.target.value) || 0)}
            />
          </Field>
        </div>
        <div className="space-y-3">
          <Typography variant="label">Mods Fund</Typography>
          <Field>
            <Label>Fund Balance</Label>
            <Input
              type="number"
              value={modFundBalance || ''}
              onChange={(e) => onModBalanceChange(Number(e.target.value) || 0)}
            />
          </Field>
          <Field>
            <Label>Added YTD</Label>
            <Input
              type="number"
              value={modYTD || ''}
              onChange={(e) => onModYTDChange(Number(e.target.value) || 0)}
            />
          </Field>
        </div>
      </div>
    </Card>
  )
}
