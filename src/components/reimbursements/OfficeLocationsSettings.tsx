import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { Card, Button, Field, Grid, Input, Label, Separator, Typography, ButtonGroup } from '@/components/ui'
import type { HealthInsuranceTemplate, OfficeTemplate } from '@/types'

// ── Office location form (shared by add and edit) ────────────────────────────

interface OfficeFormState {
  name: string
  address: string
  officeSqft: string
  totalSqft: string
}

const emptyForm = (): OfficeFormState => ({ name: '', address: '', officeSqft: '', totalSqft: '' })

function toTemplate(form: OfficeFormState, id: string): OfficeTemplate {
  return {
    id,
    name: form.name,
    address: form.address,
    officeSqft: Number(form.officeSqft) || 0,
    totalSqft: Number(form.totalSqft) || 0,
  }
}

interface OfficeFormProps {
  initial?: OfficeFormState
  onSave: (form: OfficeFormState) => void
  onCancel: () => void
  saveLabel?: string
}

function OfficeForm({ initial, onSave, onCancel, saveLabel = 'Save' }: OfficeFormProps) {
  const [form, setForm] = useState<OfficeFormState>(initial ?? emptyForm())
  const valid = form.name.trim().length > 0

  function set(field: keyof OfficeFormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-3 pt-1">
      <Grid cols={2} className="gap-3">
        <Field>
          <Label htmlFor="loc-name">Name</Label>
          <Input
            id="loc-name"
            placeholder="Home Office"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="loc-address">Address</Label>
          <Input
            id="loc-address"
            placeholder="123 Main St, Denver, CO"
            value={form.address}
            onChange={e => set('address', e.target.value)}
          />
        </Field>
      </Grid>
      <Grid cols={2} className="gap-3">
        <Field>
          <Label htmlFor="loc-office-sqft">Office sq ft</Label>
          <Input
            id="loc-office-sqft"
            type="number"
            min="0"
            step="1"
            placeholder="125"
            value={form.officeSqft}
            onChange={e => set('officeSqft', e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="loc-total-sqft">Total sq ft</Label>
          <Input
            id="loc-total-sqft"
            type="number"
            min="0"
            step="1"
            placeholder="850"
            value={form.totalSqft}
            onChange={e => set('totalSqft', e.target.value)}
          />
        </Field>
      </Grid>
      <ButtonGroup>
        <Button size="sm" onClick={() => onSave(form)} disabled={!valid}>
          <Check />
          {saveLabel}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X />
          Cancel
        </Button>
      </ButtonGroup>
    </div>
  )
}

// ── Health insurance defaults form ────────────────────────────────────────────

interface HealthFormProps {
  template: HealthInsuranceTemplate
  onUpdate: (changes: Partial<HealthInsuranceTemplate>) => void
}

function HealthInsuranceDefaults({ template, onUpdate }: HealthFormProps) {
  return (
    <div className="space-y-2">
      <Typography variant="label">Health Insurance Defaults</Typography>
      <Typography variant="small" className="text-muted-foreground">
        These amounts pre-fill each new month (100% deductible).
      </Typography>
      <Grid cols={3} className="gap-3 pt-1">
        <Field>
          <Label htmlFor="hi-health">Health</Label>
          <Input
            id="hi-health"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            prefix="$"
            value={template.health || ''}
            onChange={e => onUpdate({ health: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field>
          <Label htmlFor="hi-dental">Dental</Label>
          <Input
            id="hi-dental"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            prefix="$"
            value={template.dental || ''}
            onChange={e => onUpdate({ dental: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field>
          <Label htmlFor="hi-vision">Vision</Label>
          <Input
            id="hi-vision"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            prefix="$"
            value={template.vision || ''}
            onChange={e => onUpdate({ vision: Number(e.target.value) || 0 })}
          />
        </Field>
      </Grid>
    </div>
  )
}

// ── Main settings panel ───────────────────────────────────────────────────────

interface OfficeLocationsSettingsProps {
  templates: OfficeTemplate[]
  healthTemplate: HealthInsuranceTemplate
  onAdd: (data: Omit<OfficeTemplate, 'id'>) => void
  onUpdate: (id: string, changes: Partial<Omit<OfficeTemplate, 'id'>>) => void
  onDelete: (id: string) => void
  onHealthUpdate: (changes: Partial<HealthInsuranceTemplate>) => void
}

export function OfficeLocationsSettings({
  templates,
  healthTemplate,
  onAdd,
  onUpdate,
  onDelete,
  onHealthUpdate,
}: OfficeLocationsSettingsProps) {
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function handleAdd(form: OfficeFormState) {
    onAdd({
      name: form.name.trim(),
      address: form.address.trim(),
      officeSqft: Number(form.officeSqft) || 0,
      totalSqft: Number(form.totalSqft) || 0,
    })
    setAdding(false)
  }

  function handleEdit(id: string, form: OfficeFormState) {
    onUpdate(id, {
      name: form.name.trim(),
      address: form.address.trim(),
      officeSqft: Number(form.officeSqft) || 0,
      totalSqft: Number(form.totalSqft) || 0,
    })
    setEditingId(null)
  }

  return (
    <Card title="Locations & Defaults">
      <div className="space-y-4">
        {/* Office locations list */}
        <div className="space-y-2">
          <Typography variant="label">Office Locations</Typography>
          <Typography variant="small" className="text-muted-foreground">
            Location metadata persists; expense amounts are copied from the previous month when a new month is opened.
          </Typography>

          {templates.length === 0 && !adding && (
            <Typography variant="small" className="text-muted-foreground italic">
              No locations yet — add one below.
            </Typography>
          )}

          {templates.map(t => (
            <div key={t.id} className="rounded-md border p-3 space-y-2">
              {editingId === t.id ? (
                <OfficeForm
                  initial={{
                    name: t.name,
                    address: t.address,
                    officeSqft: String(t.officeSqft || ''),
                    totalSqft: String(t.totalSqft || ''),
                  }}
                  onSave={form => handleEdit(t.id, form)}
                  onCancel={() => setEditingId(null)}
                  saveLabel="Update"
                />
              ) : deletingId === t.id ? (
                <div className="flex items-center justify-between">
                  <Typography variant="small">
                    Delete <span className="font-medium">{t.name}</span>? This won&apos;t affect past months.
                  </Typography>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => { onDelete(t.id); setDeletingId(null) }}
                    >
                      Delete
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDeletingId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Typography variant="label">{t.name}</Typography>
                    {t.address && (
                      <Typography variant="small" className="text-muted-foreground truncate">
                        {t.address}
                      </Typography>
                    )}
                    {(t.officeSqft > 0 || t.totalSqft > 0) && (
                      <Typography variant="small" className="text-muted-foreground">
                        {t.officeSqft} / {t.totalSqft} sq ft
                        {t.totalSqft > 0 && ` (${((t.officeSqft / t.totalSqft) * 100).toFixed(1)}%)`}
                      </Typography>
                    )}
                  </div>
                  <ButtonGroup>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setEditingId(t.id); setDeletingId(null); setAdding(false) }}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setDeletingId(t.id); setEditingId(null); setAdding(false) }}
                    >
                      <Trash2 />
                    </Button>
                  </ButtonGroup>
                </div>
              )}
            </div>
          ))}

          {adding ? (
            <div className="rounded-md border p-3">
              <OfficeForm
                onSave={handleAdd}
                onCancel={() => setAdding(false)}
                saveLabel="Add Location"
              />
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setAdding(true); setEditingId(null); setDeletingId(null) }}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Location
            </Button>
          )}
        </div>

        <Separator />

        {/* Health insurance defaults */}
        <HealthInsuranceDefaults template={healthTemplate} onUpdate={onHealthUpdate} />
      </div>
    </Card>
  )
}
