import { Typography, YStack } from '@/ui'

interface SectionHeaderProps {
  title: string
  description?: string
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <YStack gap={1}>
      <Typography variant="heading">{title}</Typography>
      {description && <Typography variant="muted">{description}</Typography>}
    </YStack>
  )
}
