import { useState } from 'react'
import type { Donation } from '../types'

export function useGiving() {
  const [donations, setDonations] = useState<Donation[]>([])

  function addDonation(donation: Omit<Donation, 'id'>) {
    const newDonation: Donation = {
      ...donation,
      id: crypto.randomUUID(),
    }
    setDonations((prev) => [newDonation, ...prev])
  }

  function removeDonation(id: string) {
    setDonations((prev) => prev.filter((d) => d.id !== id))
  }

  const ytdTotal = donations.reduce((sum, d) => sum + d.amount, 0)

  return { donations, addDonation, removeDonation, ytdTotal }
}
