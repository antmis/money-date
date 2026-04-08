import { PageContainer } from '@/shared/layout'
import { SectionHeader, PageSkeleton } from '@/shared/components'
import { AllocationSliders, useAllocations } from '@/features/allocate'
import { useGoals } from '@/features/goals'

export function Allocate() {
  const { totalGoalsPerQ, loading: goalsLoading } = useGoals()
  const { rates, setRates, loading: ratesLoading } = useAllocations()
  if (goalsLoading || ratesLoading) return <PageSkeleton />

  return (
    <PageContainer>
      <SectionHeader
        title="Allocate"
        description="Set your allocation rates for tax, retirement, and giving."
      />
      <AllocationSliders
        rates={rates}
        onRatesChange={setRates}
        goalsAmount={totalGoalsPerQ}
      />
    </PageContainer>
  )
}
