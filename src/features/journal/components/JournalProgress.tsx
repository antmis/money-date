import { Typography, XStack } from '@/ui'

interface JournalProgressProps {
  currentStep: number
  totalSteps: number
}

export function JournalProgress({ currentStep, totalSteps }: JournalProgressProps) {
  if (currentStep >= totalSteps) return null

  return (
    <XStack gap={1}>
      <XStack gap={2} align="center">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <XStack
            key={i}
            className={`h-1.5 w-6 rounded-full transition-colors ${
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
