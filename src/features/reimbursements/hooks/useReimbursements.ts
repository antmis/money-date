import { useState } from 'react'
import type {
  HealthInsuranceExpenses,
  MonthlyReimbursement,
  OfficeMonthlyData,
  OfficeTemplate,
  PhoneInternetExpenses,
} from '../types'

const TEMPLATES_KEY = 'reimbursement-office-templates'
const HEALTH_KEY = 'reimbursement-health-template'

function storageKey(year: number, month: number): string {
  return `reimbursements-${year}-${month}`
}

function readTemplates(): OfficeTemplate[] {
  try {
    const stored = localStorage.getItem(TEMPLATES_KEY)
    if (stored) return JSON.parse(stored) as OfficeTemplate[]
  } catch {
    // ignore
  }
  return []
}

function readHealthTemplate(): HealthInsuranceExpenses {
  try {
    const stored = localStorage.getItem(HEALTH_KEY)
    if (stored) return JSON.parse(stored) as HealthInsuranceExpenses
  } catch {
    // ignore
  }
  return { health: 0, dental: 0, vision: 0 }
}

function loadMonthRaw(year: number, month: number): MonthlyReimbursement | null {
  try {
    const stored = localStorage.getItem(storageKey(year, month))
    if (stored) return JSON.parse(stored) as MonthlyReimbursement
  } catch {
    // ignore
  }
  return null
}

function emptyMonth(year: number, month: number): MonthlyReimbursement {
  const templates = readTemplates()
  const prevMonth = month === 1 ? loadMonthRaw(year - 1, 12) : loadMonthRaw(year, month - 1)

  const offices: OfficeMonthlyData[] = templates.map(t => {
    const prev = prevMonth?.offices?.find(o => o.templateId === t.id)
    return {
      templateId: t.id,
      name: t.name,
      address: t.address,
      officeSqft: t.officeSqft,
      totalSqft: t.totalSqft,
      alarm: prev?.alarm ?? 0,
      cleaning: prev?.cleaning ?? 0,
      rent: prev?.rent ?? 0,
      rentInsurance: prev?.rentInsurance ?? 0,
      utilities: prev?.utilities ?? 0,
    }
  })

  return {
    year,
    month,
    offices,
    businessMiles: 0,
    phoneInternet: { internet: 0, phone: 0 },
    healthInsurance: readHealthTemplate(),
    paid: false,
    paymentMethod: '',
    paidDate: '',
  }
}

function loadMonth(year: number, month: number): MonthlyReimbursement {
  const existing = loadMonthRaw(year, month)
  // Discard old-format records that predate the offices[] schema
  if (existing && Array.isArray(existing.offices)) return existing
  return emptyMonth(year, month)
}

function saveMonth(data: MonthlyReimbursement) {
  try {
    localStorage.setItem(storageKey(data.year, data.month), JSON.stringify(data))
  } catch {
    // ignore
  }
}

export function useReimbursements() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [data, setData] = useState<MonthlyReimbursement>(() => loadMonth(now.getFullYear(), now.getMonth() + 1))

  function switchMonth(newYear: number, newMonth: number) {
    setYear(newYear)
    setMonth(newMonth)
    setData(loadMonth(newYear, newMonth))
  }

  function addOfficeToMonth(template: OfficeTemplate) {
    const newOffice: OfficeMonthlyData = {
      templateId: template.id,
      name: template.name,
      address: template.address,
      officeSqft: template.officeSqft,
      totalSqft: template.totalSqft,
      alarm: 0,
      cleaning: 0,
      rent: 0,
      rentInsurance: 0,
      utilities: 0,
    }
    const updated = { ...data, offices: [...data.offices, newOffice] }
    setData(updated)
    saveMonth(updated)
  }

  function updateOffice(index: number, field: keyof OfficeMonthlyData, value: number | string) {
    const offices = data.offices.map((o, i) =>
      i === index ? { ...o, [field]: value } : o
    )
    const updated = { ...data, offices }
    setData(updated)
    saveMonth(updated)
  }

  function updateOfficeMetadata(index: number, changes: Partial<OfficeMonthlyData>) {
    const offices = data.offices.map((o, i) => i === index ? { ...o, ...changes } : o)
    const updated = { ...data, offices }
    setData(updated)
    saveMonth(updated)
  }

  function removeOfficeFromMonth(index: number) {
    const offices = data.offices.filter((_, i) => i !== index)
    const updated = { ...data, offices }
    setData(updated)
    saveMonth(updated)
  }

  function updateMiles(miles: number) {
    const updated = { ...data, businessMiles: miles }
    setData(updated)
    saveMonth(updated)
  }

  function updatePhoneInternet(field: keyof PhoneInternetExpenses, value: number) {
    const updated = { ...data, phoneInternet: { ...data.phoneInternet, [field]: value } }
    setData(updated)
    saveMonth(updated)
  }

  function updateHealthInsurance(field: keyof HealthInsuranceExpenses, value: number) {
    const updated = { ...data, healthInsurance: { ...data.healthInsurance, [field]: value } }
    setData(updated)
    saveMonth(updated)
  }

  function markPaid(paymentMethod: string, paidDate: string) {
    const updated = { ...data, paid: true, paymentMethod, paidDate }
    setData(updated)
    saveMonth(updated)
  }

  function markUnpaid() {
    const updated = { ...data, paid: false, paymentMethod: '', paidDate: '' }
    setData(updated)
    saveMonth(updated)
  }

  function getMonthData(y: number, m: number): MonthlyReimbursement {
    return loadMonth(y, m)
  }

  return {
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
  }
}
