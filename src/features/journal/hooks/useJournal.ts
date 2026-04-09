import { useState, useEffect, useCallback } from 'react'
import type { Quarter } from '@/shared/types'
import type { JournalEntry } from '../types'
import { supabase } from '@/lib/supabase'
import { useWorkspace } from '@/features/workspace'
import { toast } from 'sonner'

const PROMPTS = [
  {
    title: 'How do I feel about money this past quarter?',
    helperText: 'Not the numbers — the feeling. Anxious, relieved, proud, avoidant, unclear? Start there.',
  },
  {
    title: 'Where did I spend in alignment with my values?',
    helperText: 'Think about purchases or financial decisions that felt right. What did they have in common?',
  },
  {
    title: 'Where did I spend out of stress, convenience, or avoidance?',
    helperText: 'No judgment here. Just noticing. What were you feeling when those decisions happened?',
  },
  {
    title: 'What patterns am I noticing in my spending?',
    helperText: 'Look across the quarter. Are there recurring themes — categories, timing, emotional states?',
  },
  {
    title: 'What am I avoiding looking at financially?',
    helperText: 'This is the most important question. The thing that made you hesitate before opening this app — what is it?',
  },
]

function emptyEntry(year: number, quarter: Quarter): JournalEntry {
  return { quarter, year }
}

export function useJournal(year: number, quarter: Quarter) {
  const { activeBusiness } = useWorkspace()
  const [entry, setEntry] = useState<JournalEntry>(() => emptyEntry(year, quarter))
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!activeBusiness) return

    setLoading(true)
    supabase
      .from('journal_entries')
      .select('completed_at')
      .eq('business_id', activeBusiness.id)
      .eq('year', year)
      .eq('quarter', quarter)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) { toast.error('Failed to load journal'); setLoading(false); return }
        if (data) {
          setEntry({ quarter, year, completedAt: (data.completed_at as string) ?? undefined })
        } else {
          setEntry(emptyEntry(year, quarter))
        }
        setLoading(false)
      })
  }, [activeBusiness?.id, year, quarter])

  const save = useCallback(
    async (updated: JournalEntry) => {
      if (!activeBusiness) return
      const { error } = await supabase.from('journal_entries').upsert({
        business_id: activeBusiness.id,
        year: updated.year,
        quarter: updated.quarter,
        completed_at: updated.completedAt ?? null,
        updated_at: new Date().toISOString(),
      })
      if (error) toast.error('Failed to save journal')
    },
    [activeBusiness]
  )

  function goNext() { setCurrentStep(s => Math.min(s + 1, PROMPTS.length)) }
  function goBack() { setCurrentStep(s => Math.max(s - 1, 0)) }

  function complete() {
    const updated = { ...entry, completedAt: new Date().toISOString() }
    setEntry(updated)
    void save(updated)
    setCurrentStep(PROMPTS.length)
  }

  function reset() {
    const fresh = emptyEntry(year, quarter)
    setEntry(fresh)
    void save(fresh)
    setCurrentStep(0)
  }

  const isComplete = Boolean(entry.completedAt)

  return {
    entry,
    currentStep,
    goNext,
    goBack,
    complete,
    reset,
    isComplete,
    prompts: PROMPTS,
    loading,
  }
}
