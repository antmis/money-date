import { useState, useEffect } from 'react'
import type { Donation } from '../types'
import { supabase } from '@/lib/supabase'
import { useWorkspace } from '@/features/workspace'
import { useAuth } from '@/features/auth'
import { toast } from 'sonner'

function rowToDonation(row: Record<string, unknown>): Donation {
  return {
    id: row.id as string,
    date: row.date as string,
    organization: row.organization as string,
    amount: Number(row.amount),
    receiptName: (row.receipt_name as string) ?? undefined,
  }
}

export function useGiving() {
  const { activeBusiness } = useWorkspace()
  const { user } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeBusiness) return

    setLoading(true)
    supabase
      .from('donations')
      .select('id, date, organization, amount, receipt_name')
      .eq('business_id', activeBusiness.id)
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (error) { toast.error('Failed to load donations'); setLoading(false); return }
        setDonations((data ?? []).map(r => rowToDonation(r as Record<string, unknown>)))
        setLoading(false)
      })
  }, [activeBusiness?.id])

  async function uploadReceipt(id: string, file: File): Promise<string | null> {
    if (!user || !activeBusiness) return null
    const ext = file.name.split('.').pop() ?? 'bin'
    const path = `${user.id}/${activeBusiness.id}/${id}.${ext}`
    const { error } = await supabase.storage.from('receipts').upload(path, file, { upsert: true })
    if (error) { toast.error('Failed to upload receipt'); return null }
    return path
  }

  async function addDonation(donation: Omit<Donation, 'id'>) {
    if (!activeBusiness) return
    const id = crypto.randomUUID()

    let receiptPath: string | null = null
    if (donation.receiptFile) {
      receiptPath = await uploadReceipt(id, donation.receiptFile)
    }

    const newDonation: Donation = { ...donation, id, receiptFile: undefined }
    setDonations(prev => [newDonation, ...prev])

    const { error } = await supabase.from('donations').insert({
      id,
      business_id: activeBusiness.id,
      date: donation.date,
      organization: donation.organization,
      amount: donation.amount,
      receipt_path: receiptPath,
      receipt_name: donation.receiptName ?? null,
    })
    if (error) { setDonations(prev => prev.filter(d => d.id !== id)); toast.error('Failed to save donation') }
  }

  async function updateDonation(id: string, data: Omit<Donation, 'id'>) {
    if (!activeBusiness) return

    let receiptPath: string | null = null
    if (data.receiptFile) {
      receiptPath = await uploadReceipt(id, data.receiptFile)
    }

    setDonations(prev => prev.map(d => d.id === id ? { ...data, id, receiptFile: undefined } : d))

    const updateData: Record<string, unknown> = {
      date: data.date,
      organization: data.organization,
      amount: data.amount,
      receipt_name: data.receiptName ?? null,
    }
    if (receiptPath) updateData.receipt_path = receiptPath

    const { error } = await supabase.from('donations').update(updateData).eq('id', id).eq('business_id', activeBusiness.id)
    if (error) toast.error('Failed to update donation')
  }

  async function removeDonation(id: string) {
    if (!activeBusiness) return
    setDonations(prev => prev.filter(d => d.id !== id))
    const { error } = await supabase.from('donations').delete().eq('id', id).eq('business_id', activeBusiness.id)
    if (error) toast.error('Failed to delete donation')
  }

  const ytdTotal = donations.reduce((sum, d) => sum + d.amount, 0)

  return { donations, addDonation, updateDonation, removeDonation, ytdTotal, loading }
}
