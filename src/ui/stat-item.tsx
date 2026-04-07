import { Item, ItemContent, ItemTitle, ItemDescription, ItemActions } from '@/ui/item'
import { cn } from '@/lib/utils'

interface StatItemProps {
  label: string
  value: React.ReactNode
  className?: string
}

/** Stacked: muted label on top, value below. Use inside a Grid for stat rows. */
export function StatItem({ label, value, className }: StatItemProps) {
  return (
    <Item variant="default" size="sm" className={cn('flex-col items-start gap-0.5 p-0', className)}>
      <ItemContent>
        <ItemDescription>{label}</ItemDescription>
        <ItemTitle>{value}</ItemTitle>
      </ItemContent>
    </Item>
  )
}

interface LineItemProps {
  label: string
  value: React.ReactNode
  className?: string
}

/** Horizontal: label on the left, value on the right. Use for summary rows. */
export function LineItem({ label, value, className }: LineItemProps) {
  return (
    <Item variant="default" size="sm" className={cn('justify-between p-0', className)}>
      <ItemContent className="flex-none">
        <ItemDescription>{label}</ItemDescription>
      </ItemContent>
      <ItemActions>{value}</ItemActions>
    </Item>
  )
}
