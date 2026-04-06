import { Typography } from '@/components/ui'

interface JournalProgressProps {
  currentStep: number
  totalSteps: number
}

export function JournalProgress({ currentStep, totalSteps }: JournalProgressProps) {
  if (currentStep >= totalSteps) return null

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
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
      </div>
      <Typography variant="muted" as="span">{currentStep + 1} of {totalSteps}</Typography>
    </div>
  )
}
