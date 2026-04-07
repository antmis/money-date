import { useState, useEffect } from 'react'
import type { AllocationRates } from '../types'
import { DEFAULT_TAX_RATE, DEFAULT_SEP_RATE, DEFAULT_GIVING_RATE } from '../utils/calculations'

const STORAGE_KEY = 'money-date-allocation-rates'

const defaultRates: AllocationRates = {
  taxReserve: DEFAULT_TAX_RATE * 100,
  sepIra: DEFAULT_SEP_RATE * 100,
  giving: DEFAULT_GIVING_RATE * 100,
}

function loadRates(): AllocationRates {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as AllocationRates & { goals?: number }
      const { goals: _goals, ...clean } = parsed as typeof parsed & { goals?: number }
      void _goals
      return clean as AllocationRates
    }
  } catch { /* ignore */ }
  return defaultRates
}

export function useAllocations() {
  const [rates, setRatesState] = useState<AllocationRates>(loadRates)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rates))
  }, [rates])

  function setRates(next: AllocationRates) {
    setRatesState(next)
  }

  return { rates, setRates }
}
