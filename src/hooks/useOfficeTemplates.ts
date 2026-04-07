import { useState } from 'react'
import type { HealthInsuranceTemplate, OfficeTemplate } from '@/types'

const TEMPLATES_KEY = 'reimbursement-office-templates'
const HEALTH_KEY = 'reimbursement-health-template'

function loadTemplates(): OfficeTemplate[] {
  try {
    const stored = localStorage.getItem(TEMPLATES_KEY)
    if (stored) return JSON.parse(stored) as OfficeTemplate[]
  } catch {
    // ignore
  }
  return []
}

function saveTemplates(templates: OfficeTemplate[]) {
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
  } catch {
    // ignore
  }
}

function loadHealthTemplate(): HealthInsuranceTemplate {
  try {
    const stored = localStorage.getItem(HEALTH_KEY)
    if (stored) return JSON.parse(stored) as HealthInsuranceTemplate
  } catch {
    // ignore
  }
  return { health: 0, dental: 0, vision: 0 }
}

function saveHealthTemplate(template: HealthInsuranceTemplate) {
  try {
    localStorage.setItem(HEALTH_KEY, JSON.stringify(template))
  } catch {
    // ignore
  }
}

export function useOfficeTemplates() {
  const [templates, setTemplates] = useState<OfficeTemplate[]>(loadTemplates)

  function addTemplate(data: Omit<OfficeTemplate, 'id'>): OfficeTemplate {
    const template: OfficeTemplate = { ...data, id: crypto.randomUUID() }
    const next = [...templates, template]
    setTemplates(next)
    saveTemplates(next)
    return template
  }

  function updateTemplate(id: string, changes: Partial<Omit<OfficeTemplate, 'id'>>) {
    const next = templates.map(t => t.id === id ? { ...t, ...changes } : t)
    setTemplates(next)
    saveTemplates(next)
  }

  function deleteTemplate(id: string) {
    const next = templates.filter(t => t.id !== id)
    setTemplates(next)
    saveTemplates(next)
  }

  return { templates, addTemplate, updateTemplate, deleteTemplate }
}

export function useHealthTemplate() {
  const [template, setTemplate] = useState<HealthInsuranceTemplate>(loadHealthTemplate)

  function updateTemplate(changes: Partial<HealthInsuranceTemplate>) {
    const next = { ...template, ...changes }
    setTemplate(next)
    saveHealthTemplate(next)
  }

  return { template, updateTemplate }
}
