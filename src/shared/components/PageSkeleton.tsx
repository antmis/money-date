import { PageContainer } from '@/shared/layout'
import { Spinner, YStack } from '@/ui'

export function PageSkeleton() {
  return (
    <PageContainer>
      <YStack align="center" justify="center" className="py-24">
        <Spinner className="size-8 text-muted-foreground" />
      </YStack>
    </PageContainer>
  )
}
