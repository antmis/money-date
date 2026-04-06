import { useState } from 'react'
import type { HomeOfficeExpenses, MonthlyReimbursement, PhoneInternetExpenses } from '@/types'

const EMPTY_OFFICE: HomeOfficeExpenses = {
  address: '',
  officeSqft: 0,
  apartmentSqft: 0,
  alarm: 0,
  cleaning: 0,
  rent: 0,
  rentInsurance: 0,
  utilities: 0,
}

const EMPTY_PHONE: PhoneInternetExpenses = {
  internet: 0,
  phone: 0,
}

function storageKey(year: number, month: number): string {
  return `reimbursements-${year}-${month}`
}

function emptyMonth(year: number, month: number): MonthlyReimbursement {
  return {
    year,
    month,
    homeOffice: { ...EMPTY_OFFICE },
    recordingStudio: { ...EMPTY_OFFICE },
    businessMiles: 0,
    phoneInternet: { ...EMPTY_PHONE },
    paid: false,
    paymentMethod: '',
    paidDate: '',
  }
}

function loadMonth(year: number, month: number): MonthlyReimbursement {
  try {
    const stored = localStorage.getItem(storageKey(year, month))
    if (stored) return JSON.parse(stored) as MonthlyReimbursement
  } catch {
    // ignore
  }
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

  function updateHomeOffice(field: keyof HomeOfficeExpenses, value: number | string) {
    const updated = { ...data, homeOffice: { ...data.homeOffice, [field]: value } }
    setData(updated)
    saveMonth(updated)
  }

  function updateRecordingStudio(field: keyof HomeOfficeExpenses, value: number | string) {
    const updated = { ...data, recordingStudio: { ...data.recordingStudio, [field]: value } }
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
    updateHomeOffice,
    updateRecordingStudio,
    updateMiles,
    updatePhoneInternet,
    markPaid,
    markUnpaid,
    getMonthData,
  }
}
