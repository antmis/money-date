import { Pencil } from 'lucide-react'
import { Card, Typography } from '@/components/ui'
import type { TypographyColor } from '@/components/ui'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
  onEdit?: () => void
}

const colorMap: Record<NonNullable<StatCardProps['variant']>, TypographyColor> = {
  default: 'default',
  success: 'success',
  warning: 'caution',
  danger:  'danger',
}

export function StatCard({ label, value, sub, variant = 'default', onEdit }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <Typography variant="muted">{label}</Typography>
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-1 -mt-1 -mr-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label={`Edit ${label}`}
          >
            <Pencil size={14} />
          </button>
        )}
      </div>
      <Typography variant="value" color={colorMap[variant]}>{value}</Typography>
      {sub && <Typography variant="small">{sub}</Typography>}
    </Card>
  )
}
