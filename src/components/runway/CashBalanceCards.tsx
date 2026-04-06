import { useState } from 'react'
import { StatCard } from '@/components/shared/StatCard'
import { CashEditDialog } from '@/components/runway/CashEditDialog'

type CashField = 'businessCashBalance' | 'personalCashBalance'
type EditableField = CashField | 'monthlyFloor' | 'pipelineRemaining'

interface CashBalanceCardsProps {
  businessCashBalance: number
  personalCashBalance: number
  totalCash: number
  onChange: (field: CashField, value: number) => void
  monthlyFloor: number
  onMonthlyFloorChange: (v: number) => void
  pipelineRemaining: number
  onPipelineChange: (v: number) => void
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const fieldMeta: Record<EditableField, { title: string }> = {
  businessCashBalance: { title: 'Business Account' },
  personalCashBalance: { title: 'Personal Account' },
  monthlyFloor: { title: 'Monthly Expenses' },
  pipelineRemaining: { title: 'Remaining Pipeline' },
}

export function CashBalanceCards({
  businessCashBalance,
  personalCashBalance,
  totalCash,
  onChange,
  monthlyFloor,
  onMonthlyFloorChange,
  pipelineRemaining,
  onPipelineChange,
}: CashBalanceCardsProps) {
  const [editingField, setEditingField] = useState<EditableField | null>(null)

  function currentValue(field: EditableField): number {
    if (field === 'businessCashBalance') return businessCashBalance
    if (field === 'personalCashBalance') return personalCashBalance
    if (field === 'monthlyFloor') return monthlyFloor
    return pipelineRemaining
  }

  function handleSave(val: number) {
    if (!editingField) return
    if (editingField === 'monthlyFloor') onMonthlyFloorChange(val)
    else if (editingField === 'pipelineRemaining') onPipelineChange(val)
    else onChange(editingField, val)
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
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
          label="Monthly Expenses"
          value={fmt(monthlyFloor)}
          onEdit={() => setEditingField('monthlyFloor')}
        />
        <StatCard
          label="Remaining Pipeline"
          value={fmt(pipelineRemaining)}
          sub="High confidence invoices only"
          onEdit={() => setEditingField('pipelineRemaining')}
        />
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
