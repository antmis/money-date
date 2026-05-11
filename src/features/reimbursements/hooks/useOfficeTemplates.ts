import { useState, useEffect } from 'react'
import type { HealthInsuranceTemplate, OfficeTemplate } from '../types'
import { supabase } from '@/lib/supabase'
import { useWorkspace } from '@/features/workspace'
import { toast } from 'sonner'

export function useOfficeTemplates() {
  const { activeBusiness } = useWorkspace()
  const [allTemplates, setTemplates] = useState<OfficeTemplate[]>([])
  const [loading, setLoading] = useState(true)

  const templates = allTemplates.filter(t => !t.archived)
  const archivedTemplates = allTemplates.filter(t => t.archived)

  useEffect(() => {
    if (!activeBusiness) return

    setLoading(true)
    supabase
      .from('office_locations')
      .select('id, name, address, office_sqft, total_sqft, archived')
      .eq('business_id', activeBusiness.id)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) { toast.error('Failed to load office locations'); setLoading(false); return }
        setTemplates((data ?? []).map(r => ({
          id: r.id as string,
          name: r.name as string,
          address: r.address as string,
          officeSqft: Number(r.office_sqft),
          totalSqft: Number(r.total_sqft),
          archived: Boolean(r.archived),
        })))
        setLoading(false)
      })
  }, [activeBusiness?.id])

  async function addTemplate(data: Omit<OfficeTemplate, 'id'>): Promise<OfficeTemplate> {
    const id = crypto.randomUUID()
    const template: OfficeTemplate = { ...data, id, archived: false }
    setTemplates(prev => [...prev, template])
    if (activeBusiness) {
      const { error } = await supabase.from('office_locations').insert({
        id,
        business_id: activeBusiness.id,
        name: data.name,
        address: data.address,
        office_sqft: data.officeSqft,
        total_sqft: data.totalSqft,
      })
      if (error) { setTemplates(prev => prev.filter(t => t.id !== id)); toast.error('Failed to save office location') }
    }
    return template
  }

  async function updateTemplate(id: string, changes: Partial<Omit<OfficeTemplate, 'id'>>) {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t))
    if (!activeBusiness) return
    const { error } = await supabase.from('office_locations').update({
      ...(changes.name !== undefined && { name: changes.name }),
      ...(changes.address !== undefined && { address: changes.address }),
      ...(changes.officeSqft !== undefined && { office_sqft: changes.officeSqft }),
      ...(changes.totalSqft !== undefined && { total_sqft: changes.totalSqft }),
    }).eq('id', id).eq('business_id', activeBusiness.id)
    if (error) toast.error('Failed to update office location')
  }

  async function archiveTemplate(id: string) {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, archived: true } : t))
    if (!activeBusiness) return
    const { error } = await supabase.from('office_locations').update({ archived: true }).eq('id', id).eq('business_id', activeBusiness.id)
    if (error) { setTemplates(prev => prev.map(t => t.id === id ? { ...t, archived: false } : t)); toast.error('Failed to archive office location') }
  }

  return { templates, archivedTemplates, addTemplate, updateTemplate, archiveTemplate, loading }
}

export function useHealthTemplate() {
  const { activeBusiness } = useWorkspace()
  const [template, setTemplateState] = useState<HealthInsuranceTemplate>({ health: 0, dental: 0, vision: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeBusiness) return

    setLoading(true)
    supabase
      .from('health_insurance_config')
      .select('health, dental, vision')
      .eq('business_id', activeBusiness.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) { toast.error('Failed to load health insurance config'); setLoading(false); return }
        if (data) {
          setTemplateState({ health: Number(data.health), dental: Number(data.dental), vision: Number(data.vision) })
        }
        setLoading(false)
      })
  }, [activeBusiness?.id])

  async function updateTemplate(changes: Partial<HealthInsuranceTemplate>) {
    const next = { ...template, ...changes }
    setTemplateState(next)
    if (!activeBusiness) return
    const { error } = await supabase.from('health_insurance_config').upsert({
      business_id: activeBusiness.id,
      health: next.health,
      dental: next.dental,
      vision: next.vision,
      updated_at: new Date().toISOString(),
    })
    if (error) toast.error('Failed to save health insurance config')
  }

  return { template, updateTemplate, loading }
}
