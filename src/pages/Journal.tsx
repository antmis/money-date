import { useRef } from 'react'
import { PageContainer } from '@/shared/layout'
import { SectionHeader, PageSkeleton } from '@/shared/components'
import { JournalProgress, JournalPrompt, JournalNav, JournalSummary, useJournal } from '@/features/journal'
import { YStack, PageSwiper } from '@/ui'
import type { PageSwiperHandle } from '@/ui/swiper'
import type { Quarter } from '@/shared/types'

const currentYear = new Date().getFullYear()
const currentQuarterIndex = Math.floor(new Date().getMonth() / 3)
const currentQuarter = (['Q1', 'Q2', 'Q3', 'Q4'] as const)[currentQuarterIndex] as Quarter

export function Journal() {
  const swiperRef = useRef<PageSwiperHandle>(null)

  const {
    entry,
    currentStep,
    goTo,
    complete,
    reset,
    prompts,
    loading,
  } = useJournal(currentYear, currentQuarter)

  if (loading) return <PageSkeleton />

  const isSummary = currentStep >= prompts.length

  function handleBack() {
    swiperRef.current?.slidePrev()
  }

  function handleNext() {
    swiperRef.current?.slideNext()
  }

  function handleReset() {
    reset()
    swiperRef.current?.slideTo(0)
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Journal"
        description="Take a few moments to reflect on your past week, month, quarter, or year. Grab a journal, get comfortable, and follow the prompts to help guide your reflection."
      />

      {isSummary ? (
        <JournalSummary entry={entry} onReset={handleReset} />
      ) : (
        <YStack gap={4}>
          <JournalProgress
            currentStep={currentStep}
            totalSteps={prompts.length}
            onStepClick={(i) => swiperRef.current?.slideTo(i)}
          />

          <PageSwiper
            ref={swiperRef}
            onSlideChange={goTo}
            slides={prompts.map((p, i) => (
              <JournalPrompt
                key={i}
                promptNumber={i + 1}
                title={p.title}
                helperText={p.helperText}
              />
            ))}
          />

          <JournalNav
            currentStep={currentStep}
            totalSteps={prompts.length}
            onBack={handleBack}
            onNext={handleNext}
            onComplete={complete}
          />
        </YStack>
      )}
    </PageContainer>
  )
}
