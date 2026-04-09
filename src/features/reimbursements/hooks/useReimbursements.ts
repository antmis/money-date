import { useState, useEffect, useCallback } from 'react'
import type {
  ComputedTotals,
  HealthInsuranceExpenses,
  MonthlyReimbursement,
  OfficeMonthlyData,
  OfficeTemplate,
  PhoneInternetExpenses,
} from '../types'
import {
  calcOfficeReimbursement,
  calcMileageReimbursement,
  calcPhoneInternetReimbursement,
  calcHealthInsuranceReimbursement,
  calcTotalMonthlyReimbursement,
} from '../utils/calculations'
import { supabase } from '@/lib/supabase'
import { useWorkspace } from '@/features/workspace'
import { toast } from 'sonner'

function rowToData(row: Record<string, unknown>): MonthlyReimbursement {
  return {
    year: Number(row.year),
    month: Number(row.month),
    offices: (row.offices as OfficeMonthlyData[]) ?? [],
    businessMiles: Number(row.business_miles ?? 0),
    phoneInternet: { internetUsage: 70, phoneUsage: 70, ...((row.phone_internet as PhoneInternetExpenses) ?? { internet: 0, phone: 0 }) },
    healthInsurance: (row.health_insurance as HealthInsuranceExpenses) ?? { health: 0, dental: 0, vision: 0 },
    paid: Boolean(row.paid),
    paymentMethod: (row.payment_method as string) ?? '',
    paidDate: (row.paid_date as string) ?? '',
    computedTotals: (row.computed_totals as ComputedTotals) ?? undefined,
  }
}

function emptyMonth(year: number, month: number): MonthlyReimbursement {
  return {
    year, month, offices: [], businessMiles: 0,
    phoneInternet: { internet: 0, phone: 0, internetUsage: 50, phoneUsage: 50 },
    healthInsurance: { health: 0, dental: 0, vision: 0 },
    paid: false, paymentMethod: '', paidDate: '',
  }
}

export function useReimbursements() {
  const { activeBusiness } = useWorkspace()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [data, setData] = useState<MonthlyReimbursement>(() => emptyMonth(now.getFullYear(), now.getMonth() + 1))
  const [yearData, setYearData] = useState<MonthlyReimbursement[]>([])
  const [loading, setLoading] = useState(true)

  const fetchYearData = useCallback(async (y: number) => {
    if (!activeBusiness) return
    const { data: rows } = await supabase
      .from('monthly_reimbursements')
      .select('*')
      .eq('business_id', activeBusiness.id)
      .eq('year', y)
    setYearData((rows ?? []).map(r => rowToData(r as Record<string, unknown>)))
  }, [activeBusiness])

  const fetchMonth = useCallback(async (y: number, m: number) => {
    if (!activeBusiness) return
    setLoading(true)

    const { data: row, error } = await supabase
      .from('monthly_reimbursements')
      .select('*')
      .eq('business_id', activeBusiness.id)
      .eq('year', y)
      .eq('month', m)
      .maybeSingle()

    if (error) { toast.error('Failed to load reimbursement data'); setLoading(false); return }

    if (row) {
      setData(rowToData(row as Record<string, unknown>))
    } else {
      // Carry forward from most recent prior month
      const { data: allRows } = await supabase
        .from('monthly_reimbursements')
        .select('*')
        .eq('business_id', activeBusiness.id)
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .limit(24)

      const prevRow = allRows?.find(r =>
        Number(r.year) < y || (Number(r.year) === y && Number(r.month) < m)
      ) ?? null
      const prev = prevRow ? rowToData(prevRow as Record<string, unknown>) : null
      const empty = emptyMonth(y, m)
      if (prev) {
        empty.businessMiles = prev.businessMiles
        empty.phoneInternet = { ...prev.phoneInternet }
        empty.healthInsurance = { ...prev.healthInsurance }
        empty.offices = prev.offices.map(o => ({ ...o }))
      }
      setData(empty)
    }
    setLoading(false)
  }, [activeBusiness])

  useEffect(() => {
    if (!activeBusiness) return
    void fetchMonth(now.getFullYear(), now.getMonth() + 1)
    void fetchYearData(now.getFullYear())
  }, [activeBusiness?.id])

  const persist = useCallback(async (updated: MonthlyReimbursement) => {
    if (!activeBusiness) return
    const computedTotals: ComputedTotals = {
      officesTotal: updated.offices.reduce((sum, o) => sum + calcOfficeReimbursement(o), 0),
      milesTotal: calcMileageReimbursement(updated.businessMiles),
      phoneTotal: calcPhoneInternetReimbursement(updated.phoneInternet),
      healthTotal: calcHealthInsuranceReimbursement(updated.healthInsurance),
      total: calcTotalMonthlyReimbursement(updated),
    }
    const { error } = await supabase.from('monthly_reimbursements').upsert({
      business_id: activeBusiness.id,
      year: updated.year,
      month: updated.month,
      offices: updated.offices,
      business_miles: updated.businessMiles,
      phone_internet: updated.phoneInternet,
      health_insurance: updated.healthInsurance,
      paid: updated.paid,
      payment_method: updated.paymentMethod,
      paid_date: updated.paidDate,
      computed_totals: computedTotals,
      updated_at: new Date().toISOString(),
    })
    if (error) toast.error('Failed to save reimbursement data')
    // Refresh year data after any save
    void fetchYearData(updated.year)
  }, [activeBusiness, fetchYearData])

  async function switchMonth(newYear: number, newMonth: number) {
    setYear(newYear)
    setMonth(newMonth)
    await fetchMonth(newYear, newMonth)
    if (newYear !== year) await fetchYearData(newYear)
  }

  function addOfficeToMonth(template: OfficeTemplate) {
    const newOffice: OfficeMonthlyData = {
      templateId: template.id,
      name: template.name,
      address: template.address,
      officeSqft: template.officeSqft,
      totalSqft: template.totalSqft,
      alarm: 0, cleaning: 0, rent: 0, rentInsurance: 0, utilities: 0,
    }
    setData(prev => ({ ...prev, offices: [...prev.offices, newOffice] }))
  }

  function updateOffice(index: number, field: keyof OfficeMonthlyData, value: number | string) {
    setData(prev => {
      const offices = prev.offices.map((o, i) => i === index ? { ...o, [field]: value } : o)
      return { ...prev, offices }
    })
  }

  function updateOfficeMetadata(index: number, changes: Partial<OfficeMonthlyData>) {
    setData(prev => {
      const offices = prev.offices.map((o, i) => i === index ? { ...o, ...changes } : o)
      return { ...prev, offices }
    })
  }

  function removeOfficeFromMonth(index: number) {
    setData(prev => {
      const offices = prev.offices.filter((_, i) => i !== index)
      return { ...prev, offices }
    })
  }

  function updateMiles(miles: number) {
    setData(prev => ({ ...prev, businessMiles: miles }))
  }

  function updatePhoneInternet(field: keyof PhoneInternetExpenses, value: number) {
    setData(prev => ({ ...prev, phoneInternet: { ...prev.phoneInternet, [field]: value } }))
  }

  function updateHealthInsurance(field: keyof HealthInsuranceExpenses, value: number) {
    setData(prev => ({ ...prev, healthInsurance: { ...prev.healthInsurance, [field]: value } }))
  }

  function markPaid(paymentMethod: string, paidDate: string) {
    const updated = { ...data, paid: true, paymentMethod, paidDate }
    setData(updated)
    void persist(updated)
  }

  function markUnpaid() {
    const updated = { ...data, paid: false, paymentMethod: '', paidDate: '' }
    setData(updated)
    void persist(updated)
  }

  async function save() {
    await persist(data)
  }

  function getMonthData(y: number, m: number): MonthlyReimbursement {
    return yearData.find(r => r.year === y && r.month === m) ?? emptyMonth(y, m)
  }

  return {
    data, year, month, loading, yearData,
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
    save,
  }
}
