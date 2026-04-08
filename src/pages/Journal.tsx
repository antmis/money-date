import { PageContainer } from '@/shared/layout'
import { SectionHeader } from '@/shared/components'
import { JournalProgress, JournalPrompt, JournalNav, JournalSummary, useJournal } from '@/features/journal'
import { YStack } from '@/ui'
import type { Quarter } from '@/shared/types'

const currentYear = new Date().getFullYear()
const currentQuarterIndex = Math.floor(new Date().getMonth() / 3)
const currentQuarter = (['Q1', 'Q2', 'Q3', 'Q4'] as const)[currentQuarterIndex] as Quarter

export function Journal() {
  const {
    entry,
    answers,
    currentStep,
    updateAnswer,
    goNext,
    goBack,
    complete,
    reset,
    prompts,
  } = useJournal(currentYear, currentQuarter)

  const isSummary = currentStep >= prompts.length

  return (
    <PageContainer>
      <SectionHeader
        title="Journal"
        description="How do I actually feel about money this quarter?"
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
            value={answers[prompts[currentStep].key]}
            onChange={(val) => updateAnswer(prompts[currentStep].key, val)}
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
