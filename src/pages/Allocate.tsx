import { PageContainer } from '@/components/layout/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { AllocationSliders } from '@/components/allocate/AllocationSliders'
import { useAllocations } from '@/hooks/useAllocations'
import { useGoals } from '@/hooks/useGoals'

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
