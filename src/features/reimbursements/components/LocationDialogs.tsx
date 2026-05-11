import { Archive } from 'lucide-react'
import { Tooltip, Button, ConfirmDeleteDialog, Dialog, Field, Grid, Input, Label, XStack, YStack } from '@/ui'
import type { LocationDialogsState } from '../hooks/useLocationDialogs'
import type { LocationForm } from '../hooks/useLocationDialogs'

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
    </YStack>
  )
}

export function LocationDialogs({
  addOpen, closeAdd, handleAddLocation,
  editIndex, closeEdit, handleEditSave, handleEditToDelete,
  deleteIndex, closeDelete, handleDelete,
  form, setField, formValid, offices,
  archiveMode,
}: LocationDialogsState & { archiveMode?: boolean }) {
  return (
    <>
      {/* Add Location */}
      <Dialog
        open={addOpen}
        onOpenChange={(open) => { if (!open) closeAdd() }}
        title="Add Location"
        className="max-w-md"
        footer={
          <XStack justify="end" gap={2}>
            <Button variant="outline" onClick={closeAdd}>Cancel</Button>
            <Button onClick={handleAddLocation} disabled={!formValid}>Add Location</Button>
          </XStack>
        }
      >
        <LocationFormFields form={form} setField={setField} />
      </Dialog>

      {/* Edit Location */}
      <Dialog
        open={editIndex !== null}
        onOpenChange={(open) => { if (!open) closeEdit() }}
        title="Edit Location"
        className="max-w-md"
        footer={
          <XStack justify="between" className="w-full">
            <Button variant="destructive" onClick={handleEditToDelete}>
              {archiveMode ? <><Archive />Archive</> : 'Remove'}
            </Button>
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
        confirmLabel={archiveMode ? 'Archive' : 'Delete'}
        description={
          archiveMode
            ? `Archive "${deleteIndex !== null ? offices[deleteIndex]?.name : ''}"? It will be hidden from active locations but preserved in your history.`
            : `Remove "${deleteIndex !== null ? offices[deleteIndex]?.name : ''}" from this month? Past months are unaffected.`
        }
      />
    </>
  )
}
