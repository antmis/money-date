import { Card, Typography, XStack } from '@/ui'
import { Badge } from '@/shared/components'

type Status = 'healthy' | 'lean' | 'critical'

const advisoryText: Record<Status, string | null> = {
  healthy: null,
  lean: 'Pause truck/mods. Flex SEP to 10%.',
  critical: 'Pause all goals. Protect the floor.',
}

interface RunwayStatusProps {
  status: Status
  months: number
}

export function RunwayStatus({ status, months }: RunwayStatusProps) {
  const advisory = advisoryText[status]
  return (
    <Card>
      <XStack gap={2}>
        <Badge status={status} />
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
