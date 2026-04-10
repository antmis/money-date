import { PageContainer } from '@/shared/layout'
import { SectionHeader, PageSkeleton } from '@/shared/components'
import { JournalProgress, JournalPrompt, JournalNav, JournalSummary, useJournal } from '@/features/journal'
import { YStack } from '@/ui'
import type { Quarter } from '@/shared/types'

const currentYear = new Date().getFullYear()
const currentQuarterIndex = Math.floor(new Date().getMonth() / 3)
const currentQuarter = (['Q1', 'Q2', 'Q3', 'Q4'] as const)[currentQuarterIndex] as Quarter

export function Journal() {
  const {
    entry,
    currentStep,
    goNext,
    goBack,
    complete,
    reset,
    prompts,
    loading,
  } = useJournal(currentYear, currentQuarter)

  if (loading) return <PageSkeleton />

  const isSummary = currentStep >= prompts.length

  return (
    <PageContainer>
      <SectionHeader
        title="Journal"
        description="Take a few moments to reflect on your past week, month, quarter, or year. Grab a journal, get comfortable, and follow the prompts to help guide your reflection."
      />

      {isSummary ? (
        <JournalSummary entry={entry} onReset={reset} />
      ) : (
        <YStack gap={4}>
          <JournalProgress currentStep={currentStep} totalSteps={prompts.length} />

          <JournalPrompt
            promptNumber={currentStep + 1}
            title={prompts[currentStep].title}
            helperText={prompts[currentStep].helperText}
          />

          <JournalNav
            currentStep={currentStep}
            totalSteps={prompts.length}
            onBack={goBack}
            onNext={goNext}
            onComplete={complete}
          />
        </YStack>
      )}
    </PageContainer>
  )
}
