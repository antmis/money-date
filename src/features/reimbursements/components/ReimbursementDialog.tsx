import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Dialog, XStack, YStack, Card } from '@/ui'
import { Spinner } from '@/ui/spinner'
import type { MonthlyReimbursement, OfficeMonthlyData, OfficeTemplate, HealthInsuranceExpenses, PhoneInternetExpenses } from '../types'
import type { LocationDialogsState } from '../hooks/useLocationDialogs'
import { MonthSelector } from './MonthSelector'
import { OfficeLocationSection } from './form-sections/OfficeLocationSection'
import { MileageSection } from './form-sections/MileageSection'
import { PhoneInternetSection } from './form-sections/PhoneInternetSection'
import { HealthInsuranceSection } from './form-sections/HealthInsuranceSection'
import { ReimbursementSummary } from './ReimbursementSummary'
import { LocationDialogs } from './LocationDialogs'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface ReimbursementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  year: number
  month: number
  data: MonthlyReimbursement
  switchMonth: (y: number, m: number) => Promise<void>
  updateOffice: (index: number, field: keyof OfficeMonthlyData, value: number | string) => void
  addOfficeToMonth: (template: OfficeTemplate) => void
  updateMiles: (miles: number) => void
  updatePhoneInternet: (field: keyof PhoneInternetExpenses, value: number) => void
  updateHealthInsurance: (field: keyof HealthInsuranceExpenses, value: number) => void
  markPaid: (paymentMethod: string, paidDate: string) => void
  markUnpaid: () => void
  save: () => Promise<void>
  location: LocationDialogsState
}

export function ReimbursementDialog({
  open, onOpenChange,
  year, month, data,
  switchMonth, updateOffice,
  updateMiles, updatePhoneInternet, updateHealthInsurance,
  markPaid, markUnpaid, save,
  location,
}: ReimbursementDialogProps) {
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    setIsSaving(true)
    try {
      await save()
      toast('Reimbursement saved')
      onOpenChange(false)
    } catch {
      toast.error('Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
        title={`${MONTH_NAMES[month - 1]} ${year}`}
        className="max-w-2xl max-h-[90dvh] overflow-y-auto"
        footer={
          <XStack justify="end" gap={2}>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
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

      <LocationDialogs {...location} archiveMode />
    </>
  )
}
