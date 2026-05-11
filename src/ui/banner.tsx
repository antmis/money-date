import { useAuth } from '@/features/auth/AuthContext'
import { Badge } from '@/ui/badge'

const DEV_EMAIL = 'ar93mistretta@gmail.com'

export function Banner() {
  const { user } = useAuth()
  if (user?.email !== DEV_EMAIL) return null
  return (
    <div className="w-full bg-secondary border-b border-border flex items-center justify-center py-1">
      <Badge variant="primary">dev mode</Badge>
    </div>
  )
}
