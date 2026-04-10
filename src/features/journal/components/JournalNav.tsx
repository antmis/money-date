import { Button, XStack } from '@/ui'
import { ChevronLeft, ChevronRight, BookCheck } from 'lucide-react'

interface JournalNavProps {
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  onComplete: () => void
}

export function JournalNav({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onComplete,
}: JournalNavProps) {
  const isLast = currentStep === totalSteps - 1

  return (
    <XStack justify="between" >
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={currentStep === 0}
      >
        <ChevronLeft />
        Back
      </Button>

      {isLast ? (
        <Button onClick={onComplete}>
          <BookCheck />
          Complete Journal
        </Button>
      ) : (
        <Button onClick={onNext}>
          Next
          <ChevronRight />
        </Button>
      )}
    </XStack>
  )
}
