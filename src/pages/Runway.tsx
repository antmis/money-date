import { PageContainer } from '@/components/layout/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { StatCard } from '@/components/shared/StatCard'
import { CashBalanceCards } from '@/components/runway/CashBalanceCards'
import { Grid } from '@/components/ui'
import { RunwayStatus } from '@/components/runway/RunwayStatus'
import { useRunway } from '@/hooks/useRunway'

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export function Runway() {
  const {
    businessCashBalance,
    personalCashBalance,
    totalCash,
    setCash,
    monthlyFloor,
    setMonthlyFloor,
    monthlyPersonalExpenses,
    setMonthlyPersonalExpenses,
    totalMonthlyExpenses,
    runwayMonths,
    status,
    buffer3mo,
    buffer6mo,
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
        monthlyFloor={monthlyFloor}
        onMonthlyFloorChange={setMonthlyFloor}
        monthlyPersonalExpenses={monthlyPersonalExpenses}
        onMonthlyPersonalExpensesChange={setMonthlyPersonalExpenses}
        totalMonthlyExpenses={totalMonthlyExpenses}
      />

      <Grid>
        <StatCard
          label="Runway"
          value={`${runwayMonths.toFixed(1)} mo`}
          sub={`${fmt(totalMonthlyExpenses)}/mo total`}
          variant={statusVariant}
        />
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
      </Grid>
      
      <RunwayStatus status={status} months={runwayMonths} />
    </PageContainer>
  )
}
