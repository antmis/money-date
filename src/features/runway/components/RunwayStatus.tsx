import { Card, Typography, XStack, Badge } from '@/ui'

type Status = 'healthy' | 'lean' | 'critical'

const advisoryText: Record<Status, string | null> = {
  healthy: null,
  lean: 'Pause truck/mods. Flex SEP to 10%.',
  critical: 'Pause all goals. Protect the floor.',
}

const statusConfig = {
  healthy: { variant: 'default', label: 'Healthy' },
  lean: { variant: 'secondary', label: 'Lean' },
  critical: { variant: 'destructive', label: 'Critical' },
} as const;

interface RunwayStatusProps {
  status: Status
  months: number
}

export function RunwayStatus({ status, months }: RunwayStatusProps) {
  const advisory = advisoryText[status]
  const { variant, label } = statusConfig[status] || statusConfig.critical;
  
  return (
    <Card>
      <XStack gap={2}>
        <Badge variant={variant}>
          {label}
        </Badge>
        <Typography variant="muted" as="span">
          {months.toFixed(1)} months of runway
        </Typography>
      </XStack>
      {advisory && (
        <Typography variant="label" color="warning">{advisory}</Typography>
      )}
    </Card>
  )
}
