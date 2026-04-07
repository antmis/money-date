import { cn } from '@/lib/utils'

const colsMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
} as const

interface GridProps {
  cols?: keyof typeof colsMap
  className?: string
  children: React.ReactNode
}

export function Grid({ cols = 3, className, children }: GridProps) {
  return (
    <div className={cn('grid gap-4', colsMap[cols], className)}>
      {children}
    </div>
  )
}
