import { PageContainer } from '@/components/layout/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { JournalProgress } from '@/components/journal/JournalProgress'
import { JournalPrompt } from '@/components/journal/JournalPrompt'
import { JournalNav } from '@/components/journal/JournalNav'
import { JournalSummary } from '@/components/journal/JournalSummary'
import { useJournal } from '@/hooks/useJournal'
import { Typography } from '@/components/ui'
import type { Quarter } from '@/types'

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
    savedIndicator,
    prompts,
  } = useJournal(currentYear, currentQuarter)

  const isSummary = currentStep >= prompts.length

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <SectionHeader
          title="Journal"
          description="How do I actually feel about money this quarter?"
        />
        {savedIndicator && (
          <Typography variant="small" as="span" className="mt-1 animate-pulse">Saved</Typography>
        )}
      </div>

      {isSummary ? (
        <JournalSummary entry={entry} onReset={reset} />
      ) : (
        <div className="space-y-6">
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
        </div>
      )}
    </PageContainer>
  )
}
