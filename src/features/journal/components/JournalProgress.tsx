import { Typography, XStack } from '@/ui'

interface JournalProgressProps {
  currentStep: number
  totalSteps: number
  onStepClick?: (index: number) => void
}

export function JournalProgress({ currentStep, totalSteps, onStepClick }: JournalProgressProps) {
  if (currentStep >= totalSteps) return null

  return (
    <XStack gap={1}>
      <XStack gap={2} align="center">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <XStack
            key={i}
            onClick={() => onStepClick?.(i)}
            className={`h-1.5 w-6 rounded-full transition-colors ${
              onStepClick ? 'cursor-pointer' : ''
            } ${
              i < currentStep
                ? 'bg-foreground'
                : i === currentStep
                ? 'bg-foreground/60'
                : 'bg-border'
            }`}
          />
        ))}
      </XStack>
      <Typography className="shrink-0" variant="muted">{currentStep + 1} of {totalSteps}</Typography>
    </XStack>
  )
}
