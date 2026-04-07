import { useState } from 'react'
import { StatCard } from '@/shared/components'
import { CashEditDialog } from './CashEditDialog'
import { Grid } from '@/ui'

type CashField = 'businessCashBalance' | 'personalCashBalance'
type EditableField = CashField | 'monthlyFloor' | 'monthlyPersonalExpenses'

interface CashBalanceCardsProps {
  businessCashBalance: number
  personalCashBalance: number
  totalCash: number
  onChange: (field: CashField, value: number) => void
  monthlyFloor: number
  onMonthlyFloorChange: (v: number) => void
  monthlyPersonalExpenses: number
  onMonthlyPersonalExpensesChange: (v: number) => void
  totalMonthlyExpenses: number
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

export function CashBalanceCards({
  businessCashBalance,
  personalCashBalance,
  totalCash,
  onChange,
  monthlyFloor,
  onMonthlyFloorChange,
  monthlyPersonalExpenses,
  onMonthlyPersonalExpensesChange,
  totalMonthlyExpenses,
}: CashBalanceCardsProps) {
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
      <Grid>
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
        <StatCard
          label="Total Cash"
          value={fmt(totalCash)}
          sub="used for runway"
        />
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
        <StatCard
          label="Total Expenses"
          value={fmt(totalMonthlyExpenses)}
          sub="business + personal"
        />
      </Grid>

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
