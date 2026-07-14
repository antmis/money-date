import { useState, useEffect } from 'react'
import type { BusinessActivity } from '../types'
import { supabase } from '@/lib/supabase'
import { useWorkspace } from '@/features/workspace'
import { toast } from 'sonner'
import { computeNextOccurrenceDate, findLatestInSeries, getSeriesAnchorDay, todayISO } from '../utils/recurrence'

function rowToEntry(row: Record<string, unknown>): BusinessActivity {
  return {
    id: row.id as string,
    date: row.date as string,
    type: row.type as BusinessActivity['type'],
    customerVendorName: row.customer_vendor_name as string,
    account: row.account as string,
    amount: Number(row.amount),
    reimbursementDate: (row.reimbursement_date as string) ?? '',
    paymentMethod: row.payment_method as string,
    businessPurpose: row.business_purpose as string,
    repeatFrequency: (row.repeat_frequency as BusinessActivity['repeatFrequency']) ?? 'none',
    seriesId: (row.series_id as string) ?? null,
    confirmed: (row.confirmed as boolean) ?? true,
  }
}

/**
 * For each active recurring series (latest entry's repeatFrequency !== 'none'),
 * generates and inserts any occurrences that are now due (date <= today) but
 * don't exist yet. Runs once per fetch; relies on the (series_id, date) unique
 * index so concurrent tabs/devices resolve to a no-op instead of duplicates.
 */
async function ensureDueOccurrences(loadedEntries: BusinessActivity[], businessId: string): Promise<BusinessActivity[]> {
  const seriesIds = new Set(loadedEntries.map(e => e.seriesId).filter((id): id is string => !!id))
  const today = todayISO()
  const newRows: Record<string, unknown>[] = []

  for (const seriesId of seriesIds) {
    const anchorDay = getSeriesAnchorDay(loadedEntries, seriesId)
    let cursor = findLatestInSeries(loadedEntries, seriesId)
    let iterations = 0
    while (cursor && cursor.repeatFrequency !== 'none' && iterations < 60) {
      const nextDate = computeNextOccurrenceDate(cursor.date, cursor.repeatFrequency, anchorDay)
      if (nextDate > today) break
      newRows.push({
        id: crypto.randomUUID(),
        business_id: businessId,
        date: nextDate,
        type: cursor.type,
        customer_vendor_name: cursor.customerVendorName,
        account: cursor.account,
        amount: cursor.amount,
        reimbursement_date: null,
        payment_method: cursor.paymentMethod,
        business_purpose: cursor.businessPurpose,
        repeat_frequency: cursor.repeatFrequency,
        series_id: seriesId,
        confirmed: false,
      })
      cursor = { ...cursor, date: nextDate }
      iterations++
    }
  }

  if (newRows.length === 0) return []

  const { data, error } = await supabase
    .from('business_activity')
    .upsert(newRows, { onConflict: 'series_id,date', ignoreDuplicates: true })
    .select()

  if (error) {
    toast.error('Failed to generate recurring transactions')
    return []
  }
  return (data ?? []).map(r => rowToEntry(r as Record<string, unknown>))
}

export function useBusinessActivity() {
  const { activeBusiness } = useWorkspace()
  const [entries, setEntries] = useState<BusinessActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeBusiness) return

    setLoading(true)
    supabase
      .from('business_activity')
      .select('*')
      .eq('business_id', activeBusiness.id)
      .order('date', { ascending: false })
      .then(async ({ data, error }) => {
        if (error) { toast.error('Failed to load business activity'); setLoading(false); return }
        const loaded = (data ?? []).map(r => rowToEntry(r as Record<string, unknown>))
        const generated = await ensureDueOccurrences(loaded, activeBusiness.id)
        const all = [...generated, ...loaded].sort((a, b) => b.date.localeCompare(a.date))
        setEntries(all)
        setLoading(false)
      })
  }, [activeBusiness?.id])

  async function addEntry(data: Omit<BusinessActivity, 'id'>) {
    if (!activeBusiness) return
    const id = crypto.randomUUID()
    const seriesId = data.repeatFrequency !== 'none' ? (data.seriesId ?? id) : data.seriesId
    const entry: BusinessActivity = { ...data, id, seriesId }
    setEntries(prev => [entry, ...prev])
    const { error } = await supabase.from('business_activity').insert({
      id,
      business_id: activeBusiness.id,
      date: data.date,
      type: data.type,
      customer_vendor_name: data.customerVendorName,
      account: data.account,
      amount: data.amount,
      reimbursement_date: data.reimbursementDate || null,
      payment_method: data.paymentMethod,
      business_purpose: data.businessPurpose,
      repeat_frequency: data.repeatFrequency,
      series_id: seriesId,
      confirmed: data.confirmed,
    })
    if (error) { setEntries(prev => prev.filter(e => e.id !== id)); toast.error('Failed to save activity') }
  }

  async function updateEntry(id: string, data: Omit<BusinessActivity, 'id'>) {
    if (!activeBusiness) return
    const seriesId = data.repeatFrequency !== 'none' ? (data.seriesId ?? id) : data.seriesId
    setEntries(prev => prev.map(e => e.id === id ? { ...data, id, seriesId } : e))
    const { error } = await supabase.from('business_activity').update({
      date: data.date,
      type: data.type,
      customer_vendor_name: data.customerVendorName,
      account: data.account,
      amount: data.amount,
      reimbursement_date: data.reimbursementDate || null,
      payment_method: data.paymentMethod,
      business_purpose: data.businessPurpose,
      repeat_frequency: data.repeatFrequency,
      series_id: seriesId,
      confirmed: data.confirmed,
    }).eq('id', id).eq('business_id', activeBusiness.id)
    if (error) toast.error('Failed to update activity')
  }

  async function deleteEntry(id: string) {
    if (!activeBusiness) return
    setEntries(prev => prev.filter(e => e.id !== id))
    const { error } = await supabase.from('business_activity').delete().eq('id', id).eq('business_id', activeBusiness.id)
    if (error) toast.error('Failed to delete activity')
  }

  async function confirmEntry(id: string) {
    if (!activeBusiness) return
    setEntries(prev => prev.map(e => e.id === id ? { ...e, confirmed: true } : e))
    const { error } = await supabase.from('business_activity')
      .update({ confirmed: true })
      .eq('id', id)
      .eq('business_id', activeBusiness.id)
    if (error) toast.error('Failed to confirm activity')
  }

  async function stopRepeating(id: string) {
    if (!activeBusiness) return
    setEntries(prev => prev.map(e => e.id === id ? { ...e, repeatFrequency: 'none' } : e))
    const { error } = await supabase.from('business_activity')
      .update({ repeat_frequency: 'none' })
      .eq('id', id)
      .eq('business_id', activeBusiness.id)
    if (error) toast.error('Failed to stop repeating')
  }

  return { entries, addEntry, updateEntry, deleteEntry, confirmEntry, stopRepeating, loading }
}
