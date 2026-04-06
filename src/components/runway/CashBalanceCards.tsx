import { useState } from 'react'
import { StatCard } from '@/components/shared/StatCard'
import { CashEditDialog } from '@/components/runway/CashEditDialog'

type CashField = 'businessCashBalance' | 'personalCashBalance'

interface CashBalanceCardsProps {
  businessCashBalance: number
  personalCashBalance: number
  totalCash: number
  onChange: (field: CashField, value: number) => void
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export function CashBalanceCards({ businessCashBalance, personalCashBalance, totalCash, onChange }: CashBalanceCardsProps) {
  const [editingField, setEditingField] = useState<CashField | null>(null)

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
        <StatCard label="Total Cash" value={fmt(totalCash)} sub="used for runway" />
      </div>

      <CashEditDialog
        open={editingField !== null}
        onOpenChange={(open) => { if (!open) setEditingField(null) }}
        title={editingField === 'businessCashBalance' ? 'Business Account' : 'Personal Account'}
        value={editingField === 'businessCashBalance' ? businessCashBalance : personalCashBalance}
        onSave={(val) => editingField && onChange(editingField, val)}
      />
    </>
  )
}
