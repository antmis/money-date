import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { PageContainer } from '@/shared/layout'
import { SectionHeader } from '@/shared/components'
import { Button, XStack } from '@/ui'
import { DonationForm, GivingLog, useGiving } from '@/features/giving'
import type { Donation } from '@/features/giving'

export function Giving() {
  const [addOpen, setAddOpen] = useState(false)
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null)
  const { donations, addDonation, updateDonation, removeDonation, ytdTotal } = useGiving()

  return (
    <PageContainer>
      <XStack justify="between">
        <SectionHeader
          title="Giving"
          description="Am I actually sending the money I'm allocating? Do I have the receipts?"
        />
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Log Donation
        </Button>
      </XStack>

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
