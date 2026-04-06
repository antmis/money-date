import { PageContainer } from '@/components/layout/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { StatCard } from '@/components/shared/StatCard'
import { StatGrid } from '@/components/shared/StatGrid'
import { CashBalanceCards } from '@/components/runway/CashBalanceCards'
import { RunwayStatus } from '@/components/runway/RunwayStatus'
import { useRunway } from '@/hooks/useRunway'
import { MONTHLY_FLOOR } from '@/lib/calculations'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export function Runway() {
  const {
    businessCashBalance,
    personalCashBalance,
    totalCash,
    setCash,
    deployablePool,
    runwayMonths,
    safePerQuarter,
    status,
    buffer3mo,
    quartersRemaining,
  } = useRunway()

  const statusVariant = status === 'healthy' ? 'success' : status === 'lean' ? 'warning' : 'danger'

  return (
    <PageContainer>
      <SectionHeader
        title="Runway"
        description="How much cash do I have and how long will it last?"
      />

      <CashBalanceCards
        businessCashBalance={businessCashBalance}
        personalCashBalance={personalCashBalance}
        totalCash={totalCash}
        onChange={(field, value) => setCash({ [field]: value })}
      />

      <StatGrid>
        <StatCard
          label="Runway"
          value={`${runwayMonths.toFixed(1)} mo`}
          sub={`${fmt(MONTHLY_FLOOR)}/mo floor`}
          variant={statusVariant}
        />
        <StatCard
          label="3-Month Buffer"
          value={fmt(buffer3mo)}
          sub="minimum reserve"
        />
        <StatCard
          label="Deployable Pool"
          value={fmt(deployablePool)}
          sub="after buffer"
          variant={statusVariant}
        />
        <StatCard
          label="Safe Per Quarter"
          value={fmt(safePerQuarter)}
          sub={`${quartersRemaining} quarters remaining`}
          variant={statusVariant}
        />
      </StatGrid>

      <RunwayStatus status={status} months={runwayMonths} />
    </PageContainer>
  )
}
