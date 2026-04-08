import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth'

export interface Business {
  id: string
  name: string
}

interface WorkspaceContextValue {
  activeBusiness: Business | null
  loading: boolean
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setActiveBusiness(null)
      setLoading(false)
      return
    }

    setLoading(true)

    supabase
      .from('businesses')
      .select('id, name')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(async ({ data, error }) => {
        if (error) { setLoading(false); return }

        if (data) {
          setActiveBusiness({ id: data.id as string, name: data.name as string })
          setLoading(false)
          return
        }

        // First login — auto-create a business
        const defaultName = user.email?.split('@')[0] ?? 'My Business'
        const { data: created, error: createError } = await supabase
          .from('businesses')
          .insert({ user_id: user.id, name: defaultName })
          .select('id, name')
          .single()

        if (!createError && created) {
          setActiveBusiness({ id: created.id as string, name: created.name as string })
        }
        setLoading(false)
      })
  }, [user?.id])

  return (
    <WorkspaceContext.Provider value={{ activeBusiness, loading }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider')
  return ctx
}
