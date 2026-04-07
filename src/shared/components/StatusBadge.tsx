import { Badge as UiBadge } from '@/ui'
import { cn } from '@/lib/utils'

type Status = 'healthy' | 'lean' | 'critical'

interface BadgeProps {
  status: Status
}

const config: Record<Status, { label: string; className: string }> = {
  healthy: {
    label: 'Healthy',
    className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800',
  },
  lean: {
    label: 'Lean',
    className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800',
  },
  critical: {
    label: 'Critical',
    className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800',
  },
}

export function Badge({ status }: BadgeProps) {
  const { label, className } = config[status]
  return (
    <UiBadge variant="outline" className={cn('font-medium', className)}>
      {label}
    </UiBadge>
  )
}
