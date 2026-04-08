import { useState, useEffect } from 'react'
import type { BusinessActivity } from '../types'
import { supabase } from '@/lib/supabase'
import { useWorkspace } from '@/features/workspace'
import { toast } from 'sonner'

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
  }
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
      .then(({ data, error }) => {
        if (error) { toast.error('Failed to load business activity'); setLoading(false); return }
        setEntries((data ?? []).map(r => rowToEntry(r as Record<string, unknown>)))
        setLoading(false)
      })
  }, [activeBusiness?.id])

  async function addEntry(data: Omit<BusinessActivity, 'id'>) {
    if (!activeBusiness) return
    const id = crypto.randomUUID()
    const entry: BusinessActivity = { ...data, id }
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
    })
    if (error) { setEntries(prev => prev.filter(e => e.id !== id)); toast.error('Failed to save activity') }
  }

  async function updateEntry(id: string, data: Omit<BusinessActivity, 'id'>) {
    if (!activeBusiness) return
    setEntries(prev => prev.map(e => e.id === id ? { ...data, id } : e))
    const { error } = await supabase.from('business_activity').update({
      date: data.date,
      type: data.type,
      customer_vendor_name: data.customerVendorName,
      account: data.account,
      amount: data.amount,
      reimbursement_date: data.reimbursementDate || null,
      payment_method: data.paymentMethod,
      business_purpose: data.businessPurpose,
    }).eq('id', id).eq('business_id', activeBusiness.id)
    if (error) toast.error('Failed to update activity')
  }

  async function deleteEntry(id: string) {
    if (!activeBusiness) return
    setEntries(prev => prev.filter(e => e.id !== id))
    const { error } = await supabase.from('business_activity').delete().eq('id', id).eq('business_id', activeBusiness.id)
    if (error) toast.error('Failed to delete activity')
  }

  return { entries, addEntry, updateEntry, deleteEntry, loading }
}
