import { toast } from 'sonner'
import { PageContainer } from '@/shared/layout'
import { SectionHeader } from '@/shared/components'
import { DonationForm, GivingLog, useGiving } from '@/features/giving'

export function Giving() {
  const { donations, addDonation, ytdTotal } = useGiving()

  return (
    <PageContainer>
      <SectionHeader
        title="Giving"
        description="Am I actually sending the money I'm allocating? Do I have the receipts?"
      />

      <DonationForm
        onSubmit={(donation) => {
          addDonation(donation)
          toast.success('Donation logged ✓')
        }}
      />

      <GivingLog
        donations={donations}
        ytdTotal={ytdTotal}
      />
    </PageContainer>
  )
}
