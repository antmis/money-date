import { useState, useEffect, useCallback } from 'react'
import type { Quarter } from '@/shared/types'
import { supabase } from '@/lib/supabase'
import { useWorkspace } from '@/features/workspace'
import { toast } from 'sonner'
import {
  calcDeployablePool,
  calcRunwayMonths,
  calcSafePerQuarter,
  calcRunwayStatus,
} from '../utils/calculations'

const currentQuarterIndex = Math.floor(new Date().getMonth() / 3)
const currentQuarter = (['Q1', 'Q2', 'Q3', 'Q4'] as const)[currentQuarterIndex] as Quarter
const currentYear = new Date().getFullYear()
const quartersRemaining = Math.max(1, 4 - currentQuarterIndex)

interface RunwayConfig {
  businessCashBalance: number
  personalCashBalance: number
  monthlyFloor: number
  monthlyPersonalExpenses: number
  monthlyBusinessExpenses: number
  quarter: Quarter
  year: number
  incomeReceivedThisQ: number
}

const defaultConfig: RunwayConfig = {
  businessCashBalance: 0,
  personalCashBalance: 0,
  monthlyFloor: 0,
  monthlyPersonalExpenses: 0,
  monthlyBusinessExpenses: 0,
  quarter: currentQuarter,
  year: currentYear,
  incomeReceivedThisQ: 0,
}

export function useRunway() {
  const { activeBusiness } = useWorkspace()
  const [config, setConfig] = useState<RunwayConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeBusiness) return

    setLoading(true)
    supabase
      .from('runway_config')
      .select('*')
      .eq('business_id', activeBusiness.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) { toast.error('Failed to load runway data'); setLoading(false); return }
        if (data) {
          setConfig({
            businessCashBalance: Number(data.business_cash_balance),
            personalCashBalance: Number(data.personal_cash_balance),
            monthlyFloor: Number(data.monthly_floor),
            monthlyPersonalExpenses: Number(data.monthly_personal_expenses),
            monthlyBusinessExpenses: Number(data.monthly_business_expenses),
            quarter: data.quarter as Quarter,
            year: Number(data.year),
            incomeReceivedThisQ: Number(data.income_received_this_q),
          })
        } else {
          setConfig(defaultConfig)
        }
        setLoading(false)
      })
  }, [activeBusiness?.id])

  const persist = useCallback(async (updated: RunwayConfig) => {
    if (!activeBusiness) return
    const { error } = await supabase.from('runway_config').upsert({
      business_id: activeBusiness.id,
      business_cash_balance: updated.businessCashBalance,
      personal_cash_balance: updated.personalCashBalance,
      monthly_floor: updated.monthlyFloor,
      monthly_personal_expenses: updated.monthlyPersonalExpenses,
      monthly_business_expenses: updated.monthlyBusinessExpenses,
      quarter: updated.quarter,
      year: updated.year,
      income_received_this_q: updated.incomeReceivedThisQ,
      updated_at: new Date().toISOString(),
    })
    if (error) toast.error('Failed to save runway data')
  }, [activeBusiness])

  function setCash(next: Partial<Pick<RunwayConfig, 'businessCashBalance' | 'personalCashBalance' | 'monthlyFloor' | 'monthlyPersonalExpenses' | 'monthlyBusinessExpenses'>>) {
    setConfig((prev) => {
      const updated = { ...prev, ...next }
      void persist(updated)
      return updated
    })
  }

  function setQuarter(next: Partial<Pick<RunwayConfig, 'quarter' | 'year' | 'incomeReceivedThisQ'>>) {
    setConfig((prev) => {
      const updated = { ...prev, ...next }
      void persist(updated)
      return updated
    })
  }

  const totalCash = config.businessCashBalance + config.personalCashBalance
  const totalMonthlyExpenses = config.monthlyFloor + config.monthlyPersonalExpenses + config.monthlyBusinessExpenses
  const deployablePool = calcDeployablePool(
    { businessCashBalance: totalCash, quartersRemaining, bufferMonths: 3 },
    totalMonthlyExpenses
  )
  const runwayMonths = calcRunwayMonths(totalCash, totalMonthlyExpenses)
  const safePerQuarter = calcSafePerQuarter(deployablePool, quartersRemaining)
  const status = calcRunwayStatus(runwayMonths)

  return {
    businessCashBalance: config.businessCashBalance,
    personalCashBalance: config.personalCashBalance,
    monthlyFloor: config.monthlyFloor,
    setMonthlyFloor: (v: number) => setCash({ monthlyFloor: v }),
    monthlyPersonalExpenses: config.monthlyPersonalExpenses,
    setMonthlyPersonalExpenses: (v: number) => setCash({ monthlyPersonalExpenses: v }),
    monthlyBusinessExpenses: config.monthlyBusinessExpenses,
    setMonthlyBusinessExpenses: (v: number) => setCash({ monthlyBusinessExpenses: v }),
    totalMonthlyExpenses,
    totalCash,
    setCash,
    quarterData: { quarter: config.quarter, year: config.year, incomeReceivedThisQ: config.incomeReceivedThisQ },
    setQuarter,
    deployablePool,
    runwayMonths,
    safePerQuarter,
    status,
    buffer3mo: totalMonthlyExpenses * 3,
    buffer6mo: totalMonthlyExpenses * 6,
    quartersRemaining,
    loading,
  }
}
