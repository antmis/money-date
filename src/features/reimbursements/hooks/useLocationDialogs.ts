import { useState } from 'react'
import type { OfficeMonthlyData, OfficeTemplate } from '../types'

export interface LocationForm {
  name: string
  address: string
  officeSqft: string
  totalSqft: string
}

const emptyForm = (): LocationForm => ({ name: '', address: '', officeSqft: '', totalSqft: '' })

interface UseLocationDialogsOptions {
  offices: OfficeMonthlyData[]
  addTemplate: (data: Omit<OfficeTemplate, 'id'>) => Promise<OfficeTemplate>
  addOfficeToMonth: (template: OfficeTemplate) => void
  updateTemplate: (id: string, changes: Partial<Omit<OfficeTemplate, 'id'>>) => void
  updateOfficeMetadata: (index: number, changes: Partial<OfficeMonthlyData>) => void
  removeOfficeFromMonth: (index: number) => void
  archiveTemplate: (id: string) => void
}

export function useLocationDialogs({
  offices,
  addTemplate,
  addOfficeToMonth,
  updateTemplate,
  updateOfficeMetadata,
  removeOfficeFromMonth,
  archiveTemplate,
}: UseLocationDialogsOptions) {
  const [addOpen, setAddOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [form, setForm] = useState<LocationForm>(emptyForm())

  const formValid = form.name.trim().length > 0

  function setField(field: keyof LocationForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function openAdd() {
    setForm(emptyForm())
    setAddOpen(true)
  }

  function closeAdd() {
    setAddOpen(false)
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
    setEditIndex(index)
  }

  function closeEdit() {
    setEditIndex(null)
    setForm(emptyForm())
  }

  function handleEditSave() {
    if (editIndex === null) return
    const changes = {
      name: form.name.trim(),
      address: form.address.trim(),
      officeSqft: Number(form.officeSqft) || 0,
      totalSqft: Number(form.totalSqft) || 0,
    }
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
    archiveTemplate(offices[deleteIndex].templateId)
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
    // Add
    addOpen,
    openAdd,
    closeAdd,
    handleAddLocation,
    // Edit
    editIndex,
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
