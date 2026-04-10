import { BookOpen } from 'lucide-react'
import { Button, Card, Typography, XStack } from '@/ui'
import type { JournalEntry } from '../types'
import { Confetti, ConfettiButton } from '@/ui/confetti'

interface JournalSummaryProps {
  entry: JournalEntry
  onReset: () => void
}

export function JournalSummary({ entry, onReset }: JournalSummaryProps) {
  const submissionDate = entry.completedAt 
    ? new Date(entry.completedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) 
    : undefined;

  function handleReset() {
    onReset()
  }

  return (
    <Card 
      headerPre={<Typography variant="meta">{submissionDate}</Typography>}
      title="Journal Complete"
      description="Take a deep breath and let it settle. You are exactly where you need to be."
      footer={
        <XStack gap={2} className="flex-1 flex-wrap justify-end">
          <ConfettiButton 
            variant="outline"
            options={{
              get angle() {
                return Math.random() * 360
              },
            }}
          >
            Celebrate More 🎉
          </ConfettiButton>
          <Button
            onClick={handleReset}
          >
            <BookOpen />
            New Journal Entry
          </Button>
        </XStack>
      }
    >
      <Typography variant="blockquote">
        By choosing to view your finances without fear or hesitation, you’ve already taken the biggest step toward freedom. You’re doing great!
      </Typography>
      <Confetti className="pointer-events-none absolute top-0 left-0 z-0 size-full"/>
    </Card>
  )
}
