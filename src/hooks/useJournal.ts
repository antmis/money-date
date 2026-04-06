import { useState, useEffect, useRef, useCallback } from 'react'
import type { Quarter, JournalEntry } from '@/types'

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

function storageKey(year: number, quarter: Quarter) {
  return `journal-${year}-${quarter}`
}

function loadEntry(year: number, quarter: Quarter): JournalEntry {
  try {
    const stored = localStorage.getItem(storageKey(year, quarter))
    if (stored) return JSON.parse(stored) as JournalEntry
  } catch {
    // ignore
  }
  return {
    quarter,
    year,
    answers: {
      feeling: '',
      alignment: '',
      drift: '',
      patterns: '',
      avoidance: '',
    },
  }
}

export function useJournal(year: number, quarter: Quarter) {
  const [entry, setEntry] = useState<JournalEntry>(() => loadEntry(year, quarter))
  const [currentStep, setCurrentStep] = useState(0) // 0-4 = prompts, 5 = summary
  const [savedIndicator, setSavedIndicator] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const save = useCallback(
    (updated: JournalEntry) => {
      localStorage.setItem(storageKey(year, quarter), JSON.stringify(updated))
      setSavedIndicator(true)
      setTimeout(() => setSavedIndicator(false), 2000)
    },
    [year, quarter]
  )

  function updateAnswer(field: AnswerKey, value: string) {
    const updated = {
      ...entry,
      answers: { ...entry.answers, [field]: value },
    }
    setEntry(updated)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => save(updated), 500)
  }

  function goNext() {
    setCurrentStep((s) => Math.min(s + 1, 5))
  }

  function goBack() {
    setCurrentStep((s) => Math.max(s - 1, 0))
  }

  function complete() {
    const updated = { ...entry, completedAt: new Date().toISOString() }
    setEntry(updated)
    save(updated)
    setCurrentStep(5)
  }

  function reset() {
    const fresh: JournalEntry = {
      quarter,
      year,
      answers: { feeling: '', alignment: '', drift: '', patterns: '', avoidance: '' },
    }
    setEntry(fresh)
    localStorage.removeItem(storageKey(year, quarter))
    setCurrentStep(0)
  }

  const isComplete = Boolean(entry.completedAt)

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

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
  }
}
