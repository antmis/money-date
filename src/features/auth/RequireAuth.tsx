import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { PageSkeleton } from '@/shared/components'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <PageSkeleton />
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
