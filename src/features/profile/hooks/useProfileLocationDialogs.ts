import { useState } from 'react'
import type { OfficeTemplate, OfficeMonthlyData } from '@/features/reimbursements/types'
import type { LocationForm } from '@/features/reimbursements/hooks/useLocationDialogs'

const emptyForm = (): LocationForm => ({ name: '', address: '', officeSqft: '', totalSqft: '' })

interface Options {
  templates: OfficeTemplate[]
  addTemplate: (data: Omit<OfficeTemplate, 'id'>) => Promise<OfficeTemplate>
  updateTemplate: (id: string, changes: Partial<Omit<OfficeTemplate, 'id'>>) => void
  deleteTemplate: (id: string) => void
}

// OfficeTemplate satisfies the fields LocationDialogs reads from offices (.name)
function asMonthly(templates: OfficeTemplate[]): OfficeMonthlyData[] {
  return templates as unknown as OfficeMonthlyData[]
}

export function useProfileLocationDialogs({ templates, addTemplate, updateTemplate, deleteTemplate }: Options) {
  const [addOpen, setAddOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [form, setFormState] = useState<LocationForm>(emptyForm())

  const formValid = form.name.trim().length > 0

  function setField(field: keyof LocationForm, value: string) {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  function openAdd() { setFormState(emptyForm()); setAddOpen(true) }
  function closeAdd() { setAddOpen(false); setFormState(emptyForm()) }

  async function handleAddLocation() {
    await addTemplate({
      name: form.name.trim(),
      address: form.address.trim(),
      officeSqft: Number(form.officeSqft) || 0,
      totalSqft: Number(form.totalSqft) || 0,
    })
    closeAdd()
  }

  function openEdit(index: number) {
    const t = templates[index]
    setFormState({ name: t.name, address: t.address, officeSqft: String(t.officeSqft || ''), totalSqft: String(t.totalSqft || '') })
    setEditIndex(index)
  }

  function closeEdit() { setEditIndex(null); setFormState(emptyForm()) }

  function handleEditSave() {
    if (editIndex === null) return
    updateTemplate(templates[editIndex].id, {
      name: form.name.trim(),
      address: form.address.trim(),
      officeSqft: Number(form.officeSqft) || 0,
      totalSqft: Number(form.totalSqft) || 0,
    })
    closeEdit()
  }

  function handleEditToDelete() {
    const idx = editIndex
    closeEdit()
    if (idx !== null) setDeleteIndex(idx)
  }

  function openDelete(index: number) { setDeleteIndex(index) }
  function closeDelete() { setDeleteIndex(null) }

  function handleDelete() {
    if (deleteIndex === null) return
    deleteTemplate(templates[deleteIndex].id)
    closeDelete()
  }

  return {
    addOpen, openAdd, closeAdd, handleAddLocation,
    editIndex, openEdit, closeEdit, handleEditSave, handleEditToDelete,
    deleteIndex, openDelete, closeDelete, handleDelete,
    form, setField, formValid,
    offices: asMonthly(templates),
  }
}
