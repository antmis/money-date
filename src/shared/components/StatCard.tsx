import { Pencil } from 'lucide-react'
import { Card, Typography, Button, XStack, YStack } from '@/ui'
import type { TypographyColor } from '@/ui'

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
      <XStack justify="between">
        <YStack gap={1}>
          <Typography variant="muted">{label}</Typography>
          <Typography variant="display" color={colorMap[variant]}>{value}</Typography>
          {sub && <Typography variant="small">{sub}</Typography>}
        </YStack>
        {onEdit && (
          <Button
            onClick={onEdit}
            aria-label={`Edit ${label}`}
            size="icon-sm"
            variant="secondary"
          >
            <Pencil />
          </Button>
        )}
      </XStack>
    </Card>
  )
}
