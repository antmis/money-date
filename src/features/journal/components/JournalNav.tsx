import { Button } from '@/ui'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'

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
    <div className="flex items-center justify-between pt-2">
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={currentStep === 0}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      {isLast ? (
        <Button onClick={onComplete}>
          <CheckCircle className="h-4 w-4 mr-1.5" />
          Complete Quarter
        </Button>
      ) : (
        <Button onClick={onNext}>
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      )}
    </div>
  )
}
