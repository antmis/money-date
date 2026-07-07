import { useState } from 'react'
import type { OfficeMonthlyData, OfficeTemplate } from '../types'

export interface LocationForm {
  name: string
  address: string
  officeSqft: string
  totalSqft: string
}

type PendingAttach = { kind: 'existing'; template: OfficeTemplate } | { kind: 'new' } | null

const emptyForm = (): LocationForm => ({ name: '', address: '', officeSqft: '', totalSqft: '' })

interface UseLocationDialogsOptions {
  offices: OfficeMonthlyData[]
  templates?: OfficeTemplate[]
  addTemplate: (data: Omit<OfficeTemplate, 'id' | 'createdAt'>) => Promise<OfficeTemplate>
  addOfficeToMonth: (template: OfficeTemplate) => void
  updateTemplate: (id: string, changes: Partial<Omit<OfficeTemplate, 'id'>>) => void
  updateOfficeMetadata: (index: number, changes: Partial<OfficeMonthlyData>) => void
  removeOfficeFromMonth: (index: number) => void
}

export function useLocationDialogs({
  offices,
  templates,
  addTemplate,
  addOfficeToMonth,
  updateTemplate,
  updateOfficeMetadata,
  removeOfficeFromMonth,
}: UseLocationDialogsOptions) {
  const [addOpen, setAddOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [pending, setPending] = useState<PendingAttach>(null)
  const [form, setForm] = useState<LocationForm>(emptyForm())

  const formValid = form.name.trim().length > 0

  // Any active template not yet attached to this month can be picked manually —
  // never auto-attached, only ever added via explicit user action.
  const pickerOptions = (templates ?? []).filter(t => !offices.some(o => o.templateId === t.id))

  function setField(field: keyof LocationForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function openCreateNew() {
    setForm(emptyForm())
    setPending({ kind: 'new' })
    setAddOpen(true)
  }

  function openSelectExisting(template: OfficeTemplate) {
    setForm({
      name: template.name,
      address: template.address,
      officeSqft: String(template.officeSqft || ''),
      totalSqft: String(template.totalSqft || ''),
    })
    setPending({ kind: 'existing', template })
    setEditIndex(null)
  }

  function closeAdd() {
    setAddOpen(false)
    setPending(null)
    setForm(emptyForm())
  }

  async function handleAddLocation() {
    const template = await addTemplate({
      name: form.name.trim(),
      address: form.address.trim(),
      officeSqft: Number(form.officeSqft) || 0,
      totalSqft: Number(form.totalSqft) || 0,
    })
    addOfficeToMonth(template)
    closeAdd()
  }

  function openEdit(index: number) {
    const o = offices[index]
    setForm({ name: o.name, address: o.address, officeSqft: String(o.officeSqft || ''), totalSqft: String(o.totalSqft || '') })
    setPending(null)
    setEditIndex(index)
  }

  function closeEdit() {
    setEditIndex(null)
    setPending(null)
    setForm(emptyForm())
  }

  function handleEditSave() {
    const changes = {
      name: form.name.trim(),
      address: form.address.trim(),
      officeSqft: Number(form.officeSqft) || 0,
      totalSqft: Number(form.totalSqft) || 0,
    }
    if (pending?.kind === 'existing') {
      updateTemplate(pending.template.id, changes)
      addOfficeToMonth({ ...pending.template, ...changes })
      closeEdit()
      return
    }
    if (editIndex === null) return
    updateTemplate(offices[editIndex].templateId, changes)
    updateOfficeMetadata(editIndex, changes)
    closeEdit()
  }

  function openDelete(index: number) {
    setDeleteIndex(index)
  }

  function closeDelete() {
    setDeleteIndex(null)
  }

  function handleDelete() {
    if (deleteIndex === null) return
    removeOfficeFromMonth(deleteIndex)
    closeDelete()
  }

  // Called from Edit dialog's Remove button — go straight to delete confirm
  function handleEditToDelete() {
    const idx = editIndex
    closeEdit()
    if (idx !== null) setDeleteIndex(idx)
  }

  return {
    // Picker
    openCreateNew,
    openSelectExisting,
    pickerOptions,
    // Add
    addOpen,
    closeAdd,
    handleAddLocation,
    // Edit
    editIndex,
    isEditingExisting: pending?.kind === 'existing',
    openEdit,
    closeEdit,
    handleEditSave,
    handleEditToDelete,
    // Delete
    deleteIndex,
    openDelete,
    closeDelete,
    handleDelete,
    // Form
    form,
    setField,
    formValid,
    offices,
  }
}

export type LocationDialogsState = ReturnType<typeof useLocationDialogs>
