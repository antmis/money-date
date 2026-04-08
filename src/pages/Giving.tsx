import { useState } from 'react'
import { toast } from 'sonner'
import { PageContainer } from '@/shared/layout'
import { SectionHeader } from '@/shared/components'
import { PageSkeleton } from '@/shared/components'
import { DonationForm, GivingLog, useGiving } from '@/features/giving'
import type { Donation } from '@/features/giving'

export function Giving() {
  const [addOpen, setAddOpen] = useState(false)
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null)
  const { donations, addDonation, updateDonation, removeDonation, ytdTotal, loading } = useGiving()
  if (loading) return <PageSkeleton />

  return (
    <PageContainer>
      <SectionHeader
        title="Giving"
        description="Am I actually sending the money I'm allocating? Do I have the receipts?"
        buttonAction={() => setAddOpen(true)}
        buttonText="Log Donation"
      />

      <GivingLog
        donations={donations}
        ytdTotal={ytdTotal}
        onEdit={setEditingDonation}
      />

      {/* Add dialog */}
      <DonationForm
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={(d) => { addDonation(d); toast.success('Donation logged ✓') }}
      />

      {/* Edit dialog */}
      <DonationForm
        open={!!editingDonation}
        onOpenChange={(open) => { if (!open) setEditingDonation(null) }}
        onSubmit={(d) => { addDonation(d); toast.success('Donation logged ✓') }}
        onUpdate={(id, d) => { updateDonation(id, d); toast.success('Donation updated ✓') }}
        onDelete={(id) => { removeDonation(id); toast.success('Donation removed') }}
        donation={editingDonation ?? undefined}
      />
    </PageContainer>
  )
}
