import { PageContainer } from '@/shared/layout'
import { SectionHeader, StatCard, PageSkeleton } from '@/shared/components'
import { CashBalanceCards, RunwayStatus, useRunway } from '@/features/runway'
import { Grid, YStack } from '@/ui'

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
    loading,
  } = useRunway()

  if (loading) return <PageSkeleton />

  const statusVariant = status === 'healthy' ? 'success' : status === 'lean' ? 'warning' : 'danger'

  return (
    <PageContainer>
      <SectionHeader
        title="Runway"
        description="How much cash do I have and how long will it last?"
      />

      <YStack gap={4}>
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
      </YStack>
    </PageContainer>
  )
}
