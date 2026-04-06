import { useState } from 'react'
import { DEFAULT_HOME_CONTRIBUTION, DEFAULT_QUARTERLY_GOAL } from '@/lib/calculations'

const GOALS_KEY = 'money-date-goals'

interface GoalsState {
  homeTarget: number
  homeCurrent: number
  homeContribution: number
  truckSavingsPerQ: number
}

function loadGoals(): GoalsState {
  try {
    const stored = localStorage.getItem(GOALS_KEY)
    if (stored) return JSON.parse(stored) as GoalsState
  } catch { /* ignore */ }
  return {
    homeTarget: 100000,
    homeCurrent: 0,
    homeContribution: DEFAULT_HOME_CONTRIBUTION,
    truckSavingsPerQ: DEFAULT_QUARTERLY_GOAL,
  }
}

export function useGoals() {
  const [state, setState] = useState<GoalsState>(loadGoals)

  function update(next: Partial<GoalsState>) {
    setState((prev) => {
      const updated = { ...prev, ...next }
      localStorage.setItem(GOALS_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const totalGoalsPerQ = state.homeContribution + state.truckSavingsPerQ

  return {
    ...state,
    update,
    totalGoalsPerQ,
  }
}
