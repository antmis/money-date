import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth'
import { toast } from 'sonner'

interface Profile {
  firstName: string
  lastName: string
}

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile>({ firstName: '', lastName: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    setLoading(true)
    supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) { toast.error('Failed to load profile'); setLoading(false); return }
        if (data) {
          setProfile({ firstName: data.first_name as string, lastName: data.last_name as string })
        }
        setLoading(false)
      })
  }, [user?.id])

  async function saveProfile(firstName: string, lastName: string) {
    if (!user) return
    const { error } = await supabase.from('profiles').upsert({
      user_id: user.id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    if (error) { toast.error('Failed to save profile'); return }
    setProfile({ firstName: firstName.trim(), lastName: lastName.trim() })
    toast.success('Profile saved')
  }

  return { profile, loading, saveProfile }
}
