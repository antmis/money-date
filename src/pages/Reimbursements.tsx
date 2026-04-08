import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageContainer } from '@/shared/layout'
import { SectionHeader } from '@/shared/components'
import { Button, Dialog, XStack, YStack, Card } from '@/ui'
import { PageSkeleton } from '@/shared/components'
import { Spinner } from '@/ui/spinner'
import { toast } from 'sonner'
import {
  MonthSelector,
  OfficeLocationSection,
  MileageSection,
  PhoneInternetSection,
  HealthInsuranceSection,
  ReimbursementSummary,
  YearSummary,
  LocationDialogs,
  useReimbursements,
  useOfficeTemplates,
  useLocationDialogs,
} from '@/features/reimbursements'
import type { HealthInsuranceExpenses } from '@/features/reimbursements'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function Reimbursements() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

  async function handleSave() {
    setIsSaving(true)
    try {
      await save()
      toast('Reimbursement saved')
      setDialogOpen(false)
    } catch {
      toast.error('Failed to save')
    } finally {
      setIsSaving(false)
    }
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

      {/* Monthly entry dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={`${MONTH_NAMES[month - 1]} ${year}`}
        className="max-w-2xl max-h-[90dvh] overflow-y-auto"
        footer={
          <XStack justify="end" gap={2}>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Spinner /> : 'Save'}
            </Button>
          </XStack>
        }
      >
        <YStack gap={8}>
          <MonthSelector year={year} month={month} onChange={switchMonth} />

          {data.offices.length === 0 && (
            <Card title="No office locations added" description="Add your office location(s) to calculate reimbursements based on your workspace.">
              <Button onClick={location.openAdd}>
                <Plus />
                Add Location
              </Button>
            </Card>
          )}

          {data.offices.map((office, i) => (
            <OfficeLocationSection
              key={office.templateId + i}
              office={office}
              onChange={(field, value) => updateOffice(i, field, value)}
              onEdit={() => location.openEdit(i)}
              onDelete={() => location.openDelete(i)}
            />
          ))}

          {data.offices.length !== 0 && (
            <XStack justify="start">
              <Button variant="outline" size="sm" onClick={location.openAdd}>
                <Plus />
                Add Another Location
              </Button>
            </XStack>
          )}

          <MileageSection miles={data.businessMiles} onChange={updateMiles} />
          <PhoneInternetSection expenses={data.phoneInternet} onChange={updatePhoneInternet} />
          <HealthInsuranceSection
            health={data.healthInsurance}
            onChange={(field: keyof HealthInsuranceExpenses, value: number) => updateHealthInsurance(field, value)}
          />
          <ReimbursementSummary data={data} onMarkPaid={markPaid} onMarkUnpaid={markUnpaid} />
        </YStack>
      </Dialog>

      <LocationDialogs {...location} />
    </PageContainer>
  )
}
