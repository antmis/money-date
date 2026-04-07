import { Card, Typography } from '@/ui'
import { StatusBadge } from '@/shared/components'

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
      <div className="flex items-start gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            <Typography variant="muted" as="span">
              {months.toFixed(1)} months of runway
            </Typography>
          </div>
          {advisory && (
            <Typography variant="label" color="warning">{advisory}</Typography>
          )}
        </div>
      </div>
    </Card>
  )
}
