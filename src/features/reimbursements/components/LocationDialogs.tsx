import { Archive, Plus } from 'lucide-react'
import {
  Tooltip, Button, ConfirmDeleteDialog, Dialog, Field, Grid, Input, Label, XStack, YStack,
  Select, Typography,
} from '@/ui'
import type { LocationDialogsState } from '../hooks/useLocationDialogs'
import type { LocationForm } from '../hooks/useLocationDialogs'
import type { OfficeMonthlyData } from '../types'

interface LocationFormFieldsProps {
  form: LocationForm
  setField: (field: keyof LocationForm, value: string) => void
}

function LocationFormFields({ form, setField }: LocationFormFieldsProps) {
  return (
    <YStack gap={4}>
      <Field>
        <Label htmlFor="lf-name">Name</Label>
        <Input id="lf-name" placeholder="Home Office" value={form.name} onChange={e => setField('name', e.target.value)} />
      </Field>
      <Field>
        <Label htmlFor="lf-address">Address</Label>
        <Input id="lf-address" placeholder="123 Main St, Denver, CO 80218" value={form.address} onChange={e => setField('address', e.target.value)} />
      </Field>

      <Grid cols={2}>
        <Field>
          <Label htmlFor="lf-total-sqft">Total sq ft</Label>
          <Tooltip description="To calculate your home office deduction, enter the total square footage of your home. We use this to calculate your reimbursement %." />
          <Input id="lf-total-sqft" type="number" min="0" step="1" placeholder="850" value={form.totalSqft} onChange={e => setField('totalSqft', e.target.value)} />
        </Field>
        <Field>
          <Label htmlFor="lf-office-sqft">{form.name} sq ft</Label>
          <Tooltip description="Enter the square footage of your dedicated home office. We use this to calculate your reimbursement %." />
          <Input id="lf-office-sqft" type="number" min="0" step="1" placeholder="125" value={form.officeSqft} onChange={e => setField('officeSqft', e.target.value)} />
        </Field>
      </Grid>

      <Typography variant="muted" className="text-xs">
        Any dedicated work space in your home qualifies for the home-office deduction — it doesn't need to be a separate room or address.
      </Typography>
    </YStack>
  )
}

const CREATE_NEW = '__create_new__'

interface HomeOfficePickerProps {
  location: LocationDialogsState
  placeholder: string
  className?: string
}

export function HomeOfficePicker({ location, placeholder, className }: HomeOfficePickerProps) {
  const { openCreateNew, openSelectExisting, pickerOptions } = location

  function handleValueChange(value: string) {
    if (value === CREATE_NEW) {
      openCreateNew()
      return
    }
    const template = pickerOptions.find(t => t.id === value)
    if (template) openSelectExisting(template)
  }

  const options = [
    ...pickerOptions.map(t => ({
      value: t.id,
      label: (
        <span className="flex flex-col overflow-hidden">
          <span className="truncate">{t.name}</span>
          {t.address && <span className="truncate text-xs text-muted-foreground">{t.address}</span>}
        </span>
      ),
    })),
    {
      value: CREATE_NEW,
      label: (
        <span className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Home Office
        </span>
      ),
    },
  ]

  return (
    <Select
      value=""
      onValueChange={handleValueChange}
      options={options}
      placeholder={placeholder}
      className={className}
    />
  )
}

interface LocationDialogsProps {
  addOpen: boolean
  closeAdd: () => void
  handleAddLocation: () => void
  editIndex: number | null
  isEditingExisting?: boolean
  closeEdit: () => void
  handleEditSave: () => void
  handleEditToDelete: () => void
  deleteIndex: number | null
  closeDelete: () => void
  handleDelete: () => void
  form: LocationForm
  setField: (field: keyof LocationForm, value: string) => void
  formValid: boolean
  offices: OfficeMonthlyData[]
  archiveMode?: boolean
}

export function LocationDialogs({
  addOpen, closeAdd, handleAddLocation,
  editIndex, isEditingExisting, closeEdit, handleEditSave, handleEditToDelete,
  deleteIndex, closeDelete, handleDelete,
  form, setField, formValid, offices,
  archiveMode,
}: LocationDialogsProps) {
  const editOpen = editIndex !== null || Boolean(isEditingExisting)

  return (
    <>
      {/* Add Home Office */}
      <Dialog
        open={addOpen}
        onOpenChange={(open) => { if (!open) closeAdd() }}
        title="Add Home Office"
        className="max-w-md"
        footer={
          <XStack justify="end" gap={2}>
            <Button variant="outline" onClick={closeAdd}>Cancel</Button>
            <Button onClick={handleAddLocation} disabled={!formValid}>Add Home Office</Button>
          </XStack>
        }
      >
        <LocationFormFields form={form} setField={setField} />
      </Dialog>

      {/* Edit Home Office */}
      <Dialog
        open={editOpen}
        onOpenChange={(open) => { if (!open) closeEdit() }}
        title="Edit Home Office"
        className="max-w-md"
        footer={
          <XStack justify="between" wrap gap={2} className="w-full">
            {editIndex !== null ? (
              <Button variant="destructive" onClick={handleEditToDelete}>
                {archiveMode ? <><Archive />Archive</> : 'Remove from Month'}
              </Button>
            ) : <span />}
            <XStack gap={2}>
              <Button variant="outline" onClick={closeEdit}>Cancel</Button>
              <Button onClick={handleEditSave} disabled={!formValid}>Save</Button>
            </XStack>
          </XStack>
        }
      >
        <LocationFormFields form={form} setField={setField} />
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDeleteDialog
        open={deleteIndex !== null}
        onOpenChange={(open) => { if (!open) closeDelete() }}
        onConfirm={handleDelete}
        confirmLabel={archiveMode ? 'Archive' : 'Remove'}
        description={
          archiveMode
            ? `Archive "${deleteIndex !== null ? offices[deleteIndex]?.name : ''}"? It will be hidden from active home offices but preserved in your history.`
            : `Remove "${deleteIndex !== null ? offices[deleteIndex]?.name : ''}" from this month? Past months are unaffected.`
        }
      />
    </>
  )
}
