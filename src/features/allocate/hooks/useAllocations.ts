import { useState, useEffect } from 'react'
import type { AllocationRates } from '../types'
import { DEFAULT_TAX_RATE, DEFAULT_SEP_RATE, DEFAULT_GIVING_RATE } from '../utils/calculations'
import { supabase } from '@/lib/supabase'
import { useWorkspace } from '@/features/workspace'
import { toast } from 'sonner'

const defaultRates: AllocationRates = {
  taxReserve: DEFAULT_TAX_RATE * 100,
  sepIra: DEFAULT_SEP_RATE * 100,
  giving: DEFAULT_GIVING_RATE * 100,
}

export function useAllocations() {
  const { activeBusiness } = useWorkspace()
  const [rates, setRatesState] = useState<AllocationRates>(defaultRates)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeBusiness) return

    setLoading(true)
    supabase
      .from('allocation_rates')
      .select('tax_reserve, sep_ira, giving')
      .eq('business_id', activeBusiness.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) { toast.error('Failed to load allocation rates'); setLoading(false); return }
        if (data) {
          setRatesState({
            taxReserve: Number(data.tax_reserve),
            sepIra: Number(data.sep_ira),
            giving: Number(data.giving),
          })
        } else {
          setRatesState(defaultRates)
        }
        setLoading(false)
      })
  }, [activeBusiness?.id])

  async function setRates(next: AllocationRates) {
    setRatesState(next)
    if (!activeBusiness) return
    const { error } = await supabase.from('allocation_rates').upsert({
      business_id: activeBusiness.id,
      tax_reserve: next.taxReserve,
      sep_ira: next.sepIra,
      giving: next.giving,
      updated_at: new Date().toISOString(),
    })
    if (error) toast.error('Failed to save allocation rates')
  }

  return { rates, setRates, loading }
}
