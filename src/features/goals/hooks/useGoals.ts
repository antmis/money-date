import { useState, useEffect } from 'react'
import type { Goal } from '../types'
import { supabase } from '@/lib/supabase'
import { useWorkspace } from '@/features/workspace'
import { toast } from 'sonner'

export function useGoals() {
  const { activeBusiness } = useWorkspace()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeBusiness) return

    setLoading(true)
    supabase
      .from('goals')
      .select('id, name, target_amount, current_amount, quarterly_contribution')
      .eq('business_id', activeBusiness.id)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) { toast.error('Failed to load goals'); setLoading(false); return }
        setGoals((data ?? []).map(r => ({
          id: r.id as string,
          name: r.name as string,
          targetAmount: Number(r.target_amount),
          currentAmount: Number(r.current_amount),
          quarterlyContribution: Number(r.quarterly_contribution),
        })))
        setLoading(false)
      })
  }, [activeBusiness?.id])

  async function addGoal(data: Omit<Goal, 'id'>) {
    if (!activeBusiness) return
    const id = crypto.randomUUID()
    const goal: Goal = { ...data, id }
    setGoals(prev => [...prev, goal])
    const { error } = await supabase.from('goals').insert({
      id,
      business_id: activeBusiness.id,
      name: data.name,
      target_amount: data.targetAmount,
      current_amount: data.currentAmount,
      quarterly_contribution: data.quarterlyContribution,
    })
    if (error) { setGoals(prev => prev.filter(g => g.id !== id)); toast.error('Failed to save goal') }
  }

  async function updateGoal(id: string, patch: Partial<Omit<Goal, 'id'>>) {
    if (!activeBusiness) return
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...patch } : g))
    const { error } = await supabase.from('goals').update({
      ...(patch.name !== undefined && { name: patch.name }),
      ...(patch.targetAmount !== undefined && { target_amount: patch.targetAmount }),
      ...(patch.currentAmount !== undefined && { current_amount: patch.currentAmount }),
      ...(patch.quarterlyContribution !== undefined && { quarterly_contribution: patch.quarterlyContribution }),
    }).eq('id', id).eq('business_id', activeBusiness.id)
    if (error) toast.error('Failed to update goal')
  }

  async function deleteGoal(id: string) {
    if (!activeBusiness) return
    setGoals(prev => prev.filter(g => g.id !== id))
    const { error } = await supabase.from('goals').delete().eq('id', id).eq('business_id', activeBusiness.id)
    if (error) toast.error('Failed to delete goal')
  }

  const totalGoalsPerQ = goals.reduce((sum, g) => sum + g.quarterlyContribution, 0)

  return { goals, totalGoalsPerQ, addGoal, updateGoal, deleteGoal, loading }
}
