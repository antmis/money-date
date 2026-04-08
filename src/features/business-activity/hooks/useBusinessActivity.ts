import { useState } from 'react'
import type { BusinessActivity } from '../types'

const STORAGE_KEY = 'business-activity'

function load(): BusinessActivity[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as BusinessActivity[]
  } catch {
    // ignore
  }
  return []
}

function save(entries: BusinessActivity[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // ignore
  }
}

export function useBusinessActivity() {
  const [entries, setEntries] = useState<BusinessActivity[]>(() => load())

  function addEntry(data: Omit<BusinessActivity, 'id'>) {
    const entry: BusinessActivity = { ...data, id: crypto.randomUUID() }
    const updated = [entry, ...entries]
    setEntries(updated)
    save(updated)
  }

  function updateEntry(id: string, data: Omit<BusinessActivity, 'id'>) {
    const updated = entries.map(e => e.id === id ? { ...data, id } : e)
    setEntries(updated)
    save(updated)
  }

  function deleteEntry(id: string) {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    save(updated)
  }

  // Sort newest-first by date
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))

  return { entries: sorted, addEntry, updateEntry, deleteEntry }
}
