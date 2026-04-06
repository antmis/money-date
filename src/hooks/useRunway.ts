import { useState } from 'react'
import type { Quarter } from '@/types'
import {
  MONTHLY_FLOOR,
  calcDeployablePool,
  calcRunwayMonths,
  calcSafePerQuarter,
  calcRunwayStatus,
} from '@/lib/calculations'

const CASH_KEY = 'money-date-cash'
const QUARTER_KEY = 'money-date-quarter'

const currentQuarterIndex = Math.floor(new Date().getMonth() / 3)
const currentQuarter = (['Q1', 'Q2', 'Q3', 'Q4'] as const)[currentQuarterIndex] as Quarter
const currentYear = new Date().getFullYear()
const quartersRemaining = Math.max(1, 4 - currentQuarterIndex)

interface CashState {
  businessCashBalance: number
  personalCashBalance: number
}

interface QuarterState {
  quarter: Quarter
  year: number
  incomeReceivedThisQ: number
}

function loadCash(): CashState {
  try {
    const stored = localStorage.getItem(CASH_KEY)
    if (stored) return JSON.parse(stored) as CashState
  } catch { /* ignore */ }
  return { businessCashBalance: 0, personalCashBalance: 0 }
}

function loadQuarter(): QuarterState {
  try {
    const stored = localStorage.getItem(QUARTER_KEY)
    if (stored) return JSON.parse(stored) as QuarterState
  } catch { /* ignore */ }
  return { quarter: currentQuarter, year: currentYear, incomeReceivedThisQ: 0 }
}

export function useRunway() {
  const [cash, setCashState] = useState<CashState>(loadCash)
  const [quarterData, setQuarterState] = useState<QuarterState>(loadQuarter)

  function setCash(next: Partial<CashState>) {
    setCashState((prev) => {
      const updated = { ...prev, ...next }
      localStorage.setItem(CASH_KEY, JSON.stringify(updated))
      return updated
    })
  }

  function setQuarter(next: Partial<QuarterState>) {
    setQuarterState((prev) => {
      const updated = { ...prev, ...next }
      localStorage.setItem(QUARTER_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const totalCash = cash.businessCashBalance + cash.personalCashBalance
  const deployablePool = calcDeployablePool(
    {
      businessCashBalance: totalCash,
      pipelineRemaining: 0,
      quartersRemaining,
      bufferMonths: 3,
    },
    MONTHLY_FLOOR
  )
  const runwayMonths = calcRunwayMonths(totalCash, MONTHLY_FLOOR)
  const safePerQuarter = calcSafePerQuarter(deployablePool, quartersRemaining)
  const status = calcRunwayStatus(runwayMonths)

  return {
    businessCashBalance: cash.businessCashBalance,
    personalCashBalance: cash.personalCashBalance,
    totalCash,
    setCash,
    quarterData,
    setQuarter,
    deployablePool,
    runwayMonths,
    safePerQuarter,
    status,
    buffer3mo: MONTHLY_FLOOR * 3,
    buffer6mo: MONTHLY_FLOOR * 6,
    quartersRemaining,
  }
}
