import { Button, Typography, XStack, YStack } from '@/ui'
import { Plus } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  description?: string
  buttonAction?: () => void
  buttonText?: string
}

export function SectionHeader({ title, description, buttonAction, buttonText }: SectionHeaderProps) {
  return (
    <XStack justify="between" gap={2}>
      <YStack gap={1}>
        <Typography variant="heading">{title}</Typography>
        {description && <Typography variant="muted">{description}</Typography>}
      </YStack>
      {buttonAction &&
        <Button onClick={buttonAction}>
          <Plus /><span className="hidden sm:inline">{buttonText || 'Add Entry'}</span>
        </Button>
      }
    </XStack>
  )
}
