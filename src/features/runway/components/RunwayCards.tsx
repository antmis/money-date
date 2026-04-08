import { useState } from 'react'
import { StatCard } from '@/shared/components'
import { CashEditDialog } from './CashEditDialog'

type CashField = 'businessCashBalance' | 'personalCashBalance'
type EditableField = CashField | 'monthlyFloor' | 'monthlyPersonalExpenses'

interface RunwayCardsProps {
  businessCashBalance: number
  personalCashBalance: number
  totalCash: number
  onChange: (field: CashField, value: number) => void
  monthlyFloor: number
  onMonthlyFloorChange: (v: number) => void
  monthlyPersonalExpenses: number
  onMonthlyPersonalExpensesChange: (v: number) => void
  totalMonthlyExpenses: number
  runwayMonths: number
  statusVariant: 'success' | 'warning' | 'danger'
  buffer3mo: number
  buffer6mo: number
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const fieldMeta: Record<EditableField, { title: string }> = {
  businessCashBalance: { title: 'Business Account' },
  personalCashBalance: { title: 'Personal Account' },
  monthlyFloor: { title: 'Monthly Business Expenses' },
  monthlyPersonalExpenses: { title: 'Monthly Personal Expenses' },
}

export function RunwayCards({
  businessCashBalance,
  personalCashBalance,
  totalCash,
  onChange,
  monthlyFloor,
  onMonthlyFloorChange,
  monthlyPersonalExpenses,
  onMonthlyPersonalExpensesChange,
  totalMonthlyExpenses,
  runwayMonths,
  statusVariant,
  buffer3mo,
  buffer6mo,
}: RunwayCardsProps) {
  const [editingField, setEditingField] = useState<EditableField | null>(null)

  function currentValue(field: EditableField): number {
    if (field === 'businessCashBalance') return businessCashBalance
    if (field === 'personalCashBalance') return personalCashBalance
    if (field === 'monthlyFloor') return monthlyFloor
    return monthlyPersonalExpenses
  }

  function handleSave(val: number) {
    if (!editingField) return
    if (editingField === 'monthlyFloor') onMonthlyFloorChange(val)
    else if (editingField === 'monthlyPersonalExpenses') onMonthlyPersonalExpensesChange(val)
    else onChange(editingField, val)
  }

  return (
    <>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <StatCard
          label="Business Account"
          value={fmt(businessCashBalance)}
          onEdit={() => setEditingField('businessCashBalance')}
        />
        <StatCard
          label="Personal Account"
          value={fmt(personalCashBalance)}
          onEdit={() => setEditingField('personalCashBalance')}
        />
        <div className="col-span-2 md:col-span-1 h-full">
          <StatCard
            label="Total Cash"
            value={fmt(totalCash)}
            sub="used for runway"
          />
        </div>
        <StatCard
          label="Monthly Business Expenses"
          value={fmt(monthlyFloor)}
          onEdit={() => setEditingField('monthlyFloor')}
        />
        <StatCard
          label="Monthly Personal Expenses"
          value={fmt(monthlyPersonalExpenses)}
          onEdit={() => setEditingField('monthlyPersonalExpenses')}
        />
        <div className="col-span-2 md:col-span-1 h-full">
          <StatCard
            label="Total Expenses"
            value={fmt(totalMonthlyExpenses)}
            sub="business + personal"
          />
        </div>
        <StatCard
          label="3-Month Buffer"
          value={fmt(buffer3mo)}
          sub="minimum reserve"
        />
        <StatCard
          label="6-Month Buffer"
          value={fmt(buffer6mo)}
          sub="comfortable reserve"
        />
        <div className="col-span-2 md:col-span-1 h-full">
          <StatCard
            label="Runway"
            value={`${runwayMonths.toFixed(1)} mo`}
            sub={`${fmt(totalMonthlyExpenses)}/mo total`}
            variant={statusVariant}
          />
        </div>
      </div>

      <CashEditDialog
        open={editingField !== null}
        onOpenChange={(open) => { if (!open) setEditingField(null) }}
        title={editingField ? fieldMeta[editingField].title : ''}
        value={editingField ? currentValue(editingField) : 0}
        onSave={handleSave}
      />
    </>
  )
}
