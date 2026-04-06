import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Button, Dialog } from '@/components/ui'
import { MonthSelector } from '@/components/reimbursements/MonthSelector'
import { HomeOfficeSection } from '@/components/reimbursements/HomeOfficeSection'
import { MileageSection } from '@/components/reimbursements/MileageSection'
import { PhoneInternetSection } from '@/components/reimbursements/PhoneInternetSection'
import { YearSummary } from '@/components/reimbursements/YearSummary'
import { useReimbursements } from '@/hooks/useReimbursements'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function Reimbursements() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const {
    data,
    year,
    month,
    switchMonth,
    updateHomeOffice,
    updateRecordingStudio,
    updateMiles,
    updatePhoneInternet,
    getMonthData,
  } = useReimbursements()

  function openForMonth(y: number, m: number) {
    switchMonth(y, m)
    setDialogOpen(true)
  }

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <SectionHeader
          title="Reimbursements"
          description="Monthly business expense reimbursement — transfer from business checking to personal."
        />
        <Button onClick={() => openForMonth(year, month)} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Reimbursement
        </Button>
      </div>

      <YearSummary
        year={year}
        currentMonth={month}
        getMonthData={getMonthData}
        onEdit={openForMonth}
      />

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={`${MONTH_NAMES[month - 1]} ${year}`}
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        footer={<Button onClick={() => setDialogOpen(false)}>Done</Button>}
      >
        <MonthSelector year={year} month={month} onChange={switchMonth} />

        <HomeOfficeSection
          title="Home Office"
          expenses={data.homeOffice}
          onChange={updateHomeOffice}
        />
        <HomeOfficeSection
          title="Recording Studio"
          expenses={data.recordingStudio}
          onChange={updateRecordingStudio}
        />
        <MileageSection
          miles={data.businessMiles}
          onChange={updateMiles}
        />
        <PhoneInternetSection
          expenses={data.phoneInternet}
          onChange={updatePhoneInternet}
        />
      </Dialog>
    </PageContainer>
  )
}
