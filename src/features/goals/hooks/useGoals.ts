import { useState } from 'react'
import type { Goal } from '../types'

const GOALS_KEY = 'money-date-goals'

function loadGoals(): Goal[] {
  try {
    const stored = localStorage.getItem(GOALS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed as Goal[]
      // Discard legacy flat-object shape
      localStorage.removeItem(GOALS_KEY)
    }
  } catch { /* ignore */ }
  return []
}

function saveGoals(goals: Goal[]) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(loadGoals)

  function addGoal(data: Omit<Goal, 'id'>) {
    setGoals((prev) => {
      const next = [...prev, { ...data, id: crypto.randomUUID() }]
      saveGoals(next)
      return next
    })
  }

  function updateGoal(id: string, patch: Partial<Omit<Goal, 'id'>>) {
    setGoals((prev) => {
      const next = prev.map((g) => g.id === id ? { ...g, ...patch } : g)
      saveGoals(next)
      return next
    })
  }

  function deleteGoal(id: string) {
    setGoals((prev) => {
      const next = prev.filter((g) => g.id !== id)
      saveGoals(next)
      return next
    })
  }

  const totalGoalsPerQ = goals.reduce((sum, g) => sum + g.quarterlyContribution, 0)

  return { goals, totalGoalsPerQ, addGoal, updateGoal, deleteGoal }
}
