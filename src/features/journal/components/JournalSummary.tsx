import { useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import { Card, Button, Dialog, Typography } from '@/ui'
import { toast } from 'sonner'
import type { JournalEntry } from '../types'

const PROMPT_LABELS: Record<keyof JournalEntry['answers'], string> = {
  feeling: 'How do I feel about money this past quarter?',
  alignment: 'Where did I spend in alignment with my values?',
  drift: 'Where did I spend out of stress, convenience, or avoidance?',
  patterns: 'What patterns am I noticing in my spending?',
  avoidance: 'What am I avoiding looking at financially?',
}

interface JournalSummaryProps {
  entry: JournalEntry
  onReset: () => void
}

export function JournalSummary({ entry, onReset }: JournalSummaryProps) {
  const [open, setOpen] = useState(false)

  const keys = Object.keys(PROMPT_LABELS) as Array<keyof JournalEntry['answers']>

  function copyToClipboard() {
    const text = keys
      .map((k) => `${PROMPT_LABELS[k]}\n\n${entry.answers[k] || '—'}`)
      .join('\n\n---\n\n')
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  function handleReset() {
    setOpen(false)
    onReset()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="heading">
            {entry.quarter} {entry.year} — Reflection
          </Typography>
          {entry.completedAt && (
            <Typography variant="muted" className="mt-0.5">
              Completed {new Date(entry.completedAt).toLocaleDateString()}
            </Typography>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            Copy
          </Button>
          <Dialog
            open={open}
            onOpenChange={setOpen}
            trigger={
              <Button variant="outline" size="sm">
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                New Quarter
              </Button>
            }
            title="Start a new quarter?"
            description={`This will clear your current answers for ${entry.quarter} ${entry.year}. This cannot be undone.`}
            footer={
              <>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleReset}>Clear & Reset</Button>
              </>
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        {keys.map((key, i) => (
          <Card
            key={key}
            headerPre={<Typography variant="meta">Prompt {i + 1}</Typography>}
            title={PROMPT_LABELS[key]}
          >
            {entry.answers[key] ? (
              <Typography variant="prose" className="whitespace-pre-wrap">{entry.answers[key]}</Typography>
            ) : (
              <Typography variant="muted" className="opacity-50">—</Typography>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
