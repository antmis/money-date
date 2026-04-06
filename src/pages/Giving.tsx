import { useState } from 'react'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { DonationForm } from '@/components/giving/DonationForm'
import { GivingLog } from '@/components/giving/GivingLog'
import { Input, Label, Field, Card } from '@/components/ui'
import { useGiving } from '@/hooks/useGiving'

export function Giving() {
  const [grossIncome, setGrossIncome] = useState(0)
  const { donations, addDonation, ytdTotal, allocationPct } = useGiving(grossIncome)

  return (
    <PageContainer>
      <SectionHeader
        title="Giving"
        description="Am I actually sending the money I'm allocating? Do I have the receipts?"
      />

      <Card>
        <Field className="max-w-xs">
          <Label htmlFor="gross-income">YTD Gross Income (for % calc)</Label>
          <Input
            id="gross-income"
            type="number"
            placeholder="0"
            value={grossIncome || ''}
            onChange={(e) => setGrossIncome(Number(e.target.value) || 0)}
          />
        </Field>
      </Card>

      <DonationForm
        onSubmit={(donation) => {
          addDonation(donation)
          toast.success('Donation logged ✓')
        }}
      />

      <GivingLog
        donations={donations}
        ytdTotal={ytdTotal}
        allocationPct={allocationPct}
        grossIncome={grossIncome}
      />
    </PageContainer>
  )
}
