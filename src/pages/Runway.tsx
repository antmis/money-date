import { PageContainer } from '@/shared/layout'
import { SectionHeader, PageSkeleton } from '@/shared/components'
import { RunwayCards, RunwayStatus, useRunway } from '@/features/runway'
import { YStack } from '@/ui'

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
        <RunwayCards
          businessCashBalance={businessCashBalance}
          personalCashBalance={personalCashBalance}
          totalCash={totalCash}
          onChange={(field, value) => setCash({ [field]: value })}
          monthlyFloor={monthlyFloor}
          onMonthlyFloorChange={setMonthlyFloor}
          monthlyPersonalExpenses={monthlyPersonalExpenses}
          onMonthlyPersonalExpensesChange={setMonthlyPersonalExpenses}
          totalMonthlyExpenses={totalMonthlyExpenses}
          runwayMonths={runwayMonths}
          statusVariant={statusVariant}
          buffer3mo={buffer3mo}
          buffer6mo={buffer6mo}
        />

        <RunwayStatus status={status} months={runwayMonths} />
      </YStack>
    </PageContainer>
  )
}
