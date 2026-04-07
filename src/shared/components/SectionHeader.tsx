import { Typography } from '@/ui'

interface SectionHeaderProps {
  title: string
  description?: string
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-1">
      <Typography variant="heading">{title}</Typography>
      {description && <Typography variant="muted">{description}</Typography>}
    </div>
  )
}
