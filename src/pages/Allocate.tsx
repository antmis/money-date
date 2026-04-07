import { PageContainer } from '@/shared/layout'
import { SectionHeader } from '@/shared/components'
import { AllocationSliders, useAllocations } from '@/features/allocate'
import { useGoals } from '@/features/goals'

export function Allocate() {
  const { totalGoalsPerQ } = useGoals()
  const { rates, setRates } = useAllocations()

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
