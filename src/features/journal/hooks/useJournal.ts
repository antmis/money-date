import { useState, useEffect, useRef, useCallback } from 'react'
import type { Quarter } from '@/shared/types'
import type { JournalEntry } from '../types'
import { supabase } from '@/lib/supabase'
import { useWorkspace } from '@/features/workspace'
import { toast } from 'sonner'

type AnswerKey = keyof JournalEntry['answers']

const PROMPTS = [
  {
    key: 'feeling' as AnswerKey,
    title: 'How do I feel about money this past quarter?',
    helperText: 'Not the numbers — the feeling. Anxious, relieved, proud, avoidant, unclear? Start there.',
  },
  {
    key: 'alignment' as AnswerKey,
    title: 'Where did I spend in alignment with my values?',
    helperText: 'Think about purchases or financial decisions that felt right. What did they have in common?',
  },
  {
    key: 'drift' as AnswerKey,
    title: 'Where did I spend out of stress, convenience, or avoidance?',
    helperText: 'No judgment here. Just noticing. What were you feeling when those decisions happened?',
  },
  {
    key: 'patterns' as AnswerKey,
    title: 'What patterns am I noticing in my spending?',
    helperText: 'Look across the quarter. Are there recurring themes — categories, timing, emotional states?',
  },
  {
    key: 'avoidance' as AnswerKey,
    title: 'What am I avoiding looking at financially?',
    helperText: 'This is the most important question. The thing that made you hesitate before opening this app — what is it?',
  },
]

function emptyEntry(year: number, quarter: Quarter): JournalEntry {
  return {
    quarter,
    year,
    answers: { feeling: '', alignment: '', drift: '', patterns: '', avoidance: '' },
  }
}

export function useJournal(year: number, quarter: Quarter) {
  const { activeBusiness } = useWorkspace()
  const [entry, setEntry] = useState<JournalEntry>(() => emptyEntry(year, quarter))
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [savedIndicator, setSavedIndicator] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!activeBusiness) return

    setLoading(true)
    supabase
      .from('journal_entries')
      .select('answers, completed_at')
      .eq('business_id', activeBusiness.id)
      .eq('year', year)
      .eq('quarter', quarter)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) { toast.error('Failed to load journal'); setLoading(false); return }
        if (data) {
          setEntry({
            quarter,
            year,
            completedAt: (data.completed_at as string) ?? undefined,
            answers: (data.answers as JournalEntry['answers']) ?? emptyEntry(year, quarter).answers,
          })
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
        answers: updated.answers,
        completed_at: updated.completedAt ?? null,
        updated_at: new Date().toISOString(),
      })
      if (error) { toast.error('Failed to save journal'); return }
      setSavedIndicator(true)
      setTimeout(() => setSavedIndicator(false), 2000)
    },
    [activeBusiness]
  )

  function updateAnswer(field: AnswerKey, value: string) {
    const updated = { ...entry, answers: { ...entry.answers, [field]: value } }
    setEntry(updated)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => void save(updated), 500)
  }

  function goNext() { setCurrentStep(s => Math.min(s + 1, 5)) }
  function goBack() { setCurrentStep(s => Math.max(s - 1, 0)) }

  function complete() {
    const updated = { ...entry, completedAt: new Date().toISOString() }
    setEntry(updated)
    void save(updated)
    setCurrentStep(5)
  }

  function reset() {
    const fresh = emptyEntry(year, quarter)
    setEntry(fresh)
    void save(fresh)
    setCurrentStep(0)
  }

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [])

  const isComplete = Boolean(entry.completedAt)

  return {
    entry,
    answers: entry.answers,
    currentStep,
    updateAnswer,
    goNext,
    goBack,
    complete,
    reset,
    isComplete,
    savedIndicator,
    prompts: PROMPTS,
    loading,
  }
}
