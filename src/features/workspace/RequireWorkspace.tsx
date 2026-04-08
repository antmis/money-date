import { useWorkspace } from './WorkspaceContext'
import { PageSkeleton } from '@/shared/components'

export function RequireWorkspace({ children }: { children: React.ReactNode }) {
  const { loading } = useWorkspace()
  if (loading) return <PageSkeleton />
  return <>{children}</>
}
