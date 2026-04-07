import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageContainer } from '@/shared/layout'
import { SectionHeader } from '@/shared/components'
import { Button, Dialog, Field, Grid, Input, Label } from '@/ui'
import {
  MonthSelector,
  OfficeLocationSection,
  MileageSection,
  PhoneInternetSection,
  HealthInsuranceSection,
  ReimbursementSummary,
  YearSummary,
  useReimbursements,
  useOfficeTemplates,
  useHealthTemplate,
} from '@/features/reimbursements'
import type { HealthInsuranceExpenses } from '@/features/reimbursements'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface LocationForm {
  name: string
  address: string
  officeSqft: string
  totalSqft: string
}

const emptyForm = (): LocationForm => ({ name: '', address: '', officeSqft: '', totalSqft: '' })

export function Reimbursements() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addLocationOpen, setAddLocationOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [form, setForm] = useState<LocationForm>(emptyForm())

  const {
    data,
    year,
    month,
    switchMonth,
    addOfficeToMonth,
    updateOffice,
    updateOfficeMetadata,
    removeOfficeFromMonth,
    updateMiles,
    updatePhoneInternet,
    updateHealthInsurance,
    markPaid,
    markUnpaid,
    getMonthData,
  } = useReimbursements()

  const { addTemplate, updateTemplate } = useOfficeTemplates()
  const { updateTemplate: updateHealthTemplate } = useHealthTemplate()

  // Get current date object
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  function openForMonth(y: number, m: number) {
    switchMonth(y, m)
    setDialogOpen(true)
  }

  function handleYearChange(newYear: number) {
    switchMonth(newYear, month)
  }

  function handleHealthChange(field: keyof HealthInsuranceExpenses, value: number) {
    updateHealthInsurance(field, value)
    updateHealthTemplate({ [field]: value })
  }

  function setField(field: keyof LocationForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleAddLocation() {
    const template = addTemplate({
      name: form.name.trim(),
      address: form.address.trim(),
      officeSqft: Number(form.officeSqft) || 0,
      totalSqft: Number(form.totalSqft) || 0,
    })
    addOfficeToMonth(template)
    setForm(emptyForm())
    setAddLocationOpen(false)
  }

  function openEdit(index: number) {
    const o = data.offices[index]
    setForm({ name: o.name, address: o.address, officeSqft: String(o.officeSqft || ''), totalSqft: String(o.totalSqft || '') })
    setEditIndex(index)
  }

  function handleEditSave() {
    if (editIndex === null) return
    const changes = {
      name: form.name.trim(),
      address: form.address.trim(),
      officeSqft: Number(form.officeSqft) || 0,
      totalSqft: Number(form.totalSqft) || 0,
    }
    // Update template so future months pick up the change
    updateTemplate(data.offices[editIndex].templateId, changes)
    // Update this month's snapshot
    updateOfficeMetadata(editIndex, changes)
    setEditIndex(null)
    setForm(emptyForm())
  }

  function handleDelete() {
    if (deleteIndex === null) return
    removeOfficeFromMonth(deleteIndex)
    setDeleteIndex(null)
  }

  const formValid = form.name.trim().length > 0

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <SectionHeader
          title="Reimbursements"
          description="Monthly business expense reimbursement — transfer from business checking to personal."
        />
        <Button onClick={() => openForMonth(currentYear, currentMonth)}><Plus /> New Reimbursement</Button>
      </div>

      <YearSummary
        year={year}
        currentMonth={month}
        getMonthData={getMonthData}
        onEdit={openForMonth}
        onYearChange={handleYearChange}
      />

      {/* Add Location modal */}
      <Dialog
        open={addLocationOpen}
        onOpenChange={(open) => { setAddLocationOpen(open); if (!open) setForm(emptyForm()) }}
        title="Add Location"
        className="max-w-md"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setAddLocationOpen(false); setForm(emptyForm()) }}>Cancel</Button>
            <Button onClick={handleAddLocation} disabled={!formValid}>Add Location</Button>
          </div>
        }
      >
        <LocationFormFields form={form} setField={setField} />
      </Dialog>

      {/* Edit Location modal */}
      <Dialog
        open={editIndex !== null}
        onOpenChange={(open) => { if (!open) { setEditIndex(null); setForm(emptyForm()) } }}
        title="Edit Location"
        className="max-w-md"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setEditIndex(null); setForm(emptyForm()) }}>Cancel</Button>
            <Button onClick={handleEditSave} disabled={!formValid}>Save</Button>
          </div>
        }
      >
        <LocationFormFields form={form} setField={setField} />
      </Dialog>

      {/* Delete confirmation modal */}
      <Dialog
        open={deleteIndex !== null}
        onOpenChange={(open) => { if (!open) setDeleteIndex(null) }}
        title="Remove Location"
        className="max-w-sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeleteIndex(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Remove</Button>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground">
          Remove <span className="font-medium text-foreground">{deleteIndex !== null ? data.offices[deleteIndex]?.name : ''}</span> from this month? Past months are unaffected.
        </p>
      </Dialog>

      {/* Monthly entry dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={`${MONTH_NAMES[month - 1]} ${year}`}
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        footer={<Button onClick={() => setDialogOpen(false)}>Done</Button>}
      >
        <MonthSelector year={year} month={month} onChange={switchMonth} />

        {data.offices.map((office, i) => (
          <OfficeLocationSection
            key={office.templateId + i}
            office={office}
            onChange={(field, value) => updateOffice(i, field, value)}
            onEdit={() => openEdit(i)}
            onDelete={() => setDeleteIndex(i)}
          />
        ))}

        <Button variant="outline" size="sm" onClick={() => setAddLocationOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Location
        </Button>

        <MileageSection miles={data.businessMiles} onChange={updateMiles} />
        <PhoneInternetSection expenses={data.phoneInternet} onChange={updatePhoneInternet} />
        <HealthInsuranceSection health={data.healthInsurance} onChange={handleHealthChange} />
        <ReimbursementSummary data={data} onMarkPaid={markPaid} onMarkUnpaid={markUnpaid} />
      </Dialog>
    </PageContainer>
  )
}

interface LocationFormFieldsProps {
  form: LocationForm
  setField: (field: keyof LocationForm, value: string) => void
}

function LocationFormFields({ form, setField }: LocationFormFieldsProps) {
  return (
    <div className="space-y-3">
      <Field>
        <Label htmlFor="lf-name">Name</Label>
        <Input id="lf-name" placeholder="Home Office" value={form.name} onChange={e => setField('name', e.target.value)} />
      </Field>
      <Field>
        <Label htmlFor="lf-address">Address</Label>
        <Input id="lf-address" placeholder="123 Main St, Denver, CO 80218" value={form.address} onChange={e => setField('address', e.target.value)} />
      </Field>
      <Grid cols={2} className="gap-3">
        <Field>
          <Label htmlFor="lf-office-sqft">Office sq ft</Label>
          <Input id="lf-office-sqft" type="number" min="0" step="1" placeholder="125" value={form.officeSqft} onChange={e => setField('officeSqft', e.target.value)} />
        </Field>
        <Field>
          <Label htmlFor="lf-total-sqft">Total sq ft of unit</Label>
          <Input id="lf-total-sqft" type="number" min="0" step="1" placeholder="850" value={form.totalSqft} onChange={e => setField('totalSqft', e.target.value)} />
        </Field>
      </Grid>
    </div>
  )
}
