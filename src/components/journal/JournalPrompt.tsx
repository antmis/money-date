import { Card, Textarea, Typography } from '@/components/ui'

interface JournalPromptProps {
  promptNumber: number
  title: string
  helperText: string
  value: string
  onChange: (value: string) => void
}

export function JournalPrompt({
  promptNumber,
  title,
  helperText,
  value,
  onChange,
}: JournalPromptProps) {
  return (
    <Card
      headerPre={<Typography variant="meta">Prompt {promptNumber}</Typography>}
      title={title}
      headerPost={<Typography variant="muted">{helperText}</Typography>}
    >
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-40 resize-none text-base leading-relaxed"
        placeholder="Write freely…"
      />
    </Card>
  )
}
