import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { DonationForm } from '@/components/giving/DonationForm'
import { GivingLog } from '@/components/giving/GivingLog'
import { useGiving } from '@/hooks/useGiving'

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
