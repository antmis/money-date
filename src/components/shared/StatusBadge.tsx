import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

type Status = 'healthy' | 'lean' | 'critical'

interface StatusBadgeProps {
  status: Status
}

const config: Record<Status, { label: string; className: string }> = {
  healthy: {
    label: 'Healthy',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  },
  lean: {
    label: 'Lean',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  },
  critical: {
    label: 'Critical',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = config[status]
  return (
    <Badge variant="outline" className={cn('font-medium', className)}>
      {label}
    </Badge>
  )
}
