import { Card, Typography } from '@/ui'

interface JournalPromptProps {
  promptNumber: number
  title: string
  helperText: string
}

export function JournalPrompt({ promptNumber, title, helperText }: JournalPromptProps) {
  return (
    <Card
      headerPre={<Typography variant="meta">Prompt {promptNumber}</Typography>}
      title={title}
      description={helperText}
    />
  )
}
