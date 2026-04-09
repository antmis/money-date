import { useState } from 'react'
import { PageContainer } from '@/shared/layout'
import { SectionHeader } from '@/shared/components'
import { PageSkeleton } from '@/shared/components'
import {
  ReimbursementDialog,
  YearSummary,
  useReimbursements,
  useOfficeTemplates,
  useLocationDialogs,
} from '@/features/reimbursements'

export function Reimbursements() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const {
    data, year, month, yearData, loading,
    switchMonth, addOfficeToMonth, updateOffice, updateOfficeMetadata,
    removeOfficeFromMonth, updateMiles, updatePhoneInternet,
    updateHealthInsurance, markPaid, markUnpaid, save,
  } = useReimbursements()

  const { addTemplate, updateTemplate } = useOfficeTemplates()

  const location = useLocationDialogs({
    offices: data.offices,
    addTemplate,
    addOfficeToMonth,
    updateTemplate,
    updateOfficeMetadata,
    removeOfficeFromMonth,
  })

  if (loading) return <PageSkeleton />

  const now = new Date()

  function openForMonth(y: number, m: number) {
    switchMonth(y, m)
    setDialogOpen(true)
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Reimbursements"
        description="Monthly business expense reimbursement — transfer from business checking to personal."
        buttonAction={() => openForMonth(now.getFullYear(), now.getMonth() + 1)}
        buttonText="New Reimbursement"
      />

      <YearSummary
        year={year}
        currentMonth={month}
        yearData={yearData}
        onEdit={openForMonth}
        onYearChange={(newYear) => void switchMonth(newYear, month)}
      />

      <ReimbursementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        year={year}
        month={month}
        data={data}
        switchMonth={switchMonth}
        updateOffice={updateOffice}
        addOfficeToMonth={addOfficeToMonth}
        updateMiles={updateMiles}
        updatePhoneInternet={updatePhoneInternet}
        updateHealthInsurance={updateHealthInsurance}
        markPaid={markPaid}
        markUnpaid={markUnpaid}
        save={save}
        location={location}
      />
    </PageContainer>
  )
}
