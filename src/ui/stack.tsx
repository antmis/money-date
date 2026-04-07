import * as React from 'react'
import { cn } from '@/lib/utils'

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tailwind spacing scale — 1 = 4px, 2 = 8px, 4 = 16px, etc. */
  gap?: number
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: boolean
}

const alignMap: Record<NonNullable<StackProps['align']>, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const justifyMap: Record<NonNullable<StackProps['justify']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

function buildStackStyle(gap?: number, style?: React.CSSProperties): React.CSSProperties | undefined {
  if (gap === undefined) return style
  return { gap: `${gap * 0.25}rem`, ...style }
}

// ── Vertical stack (column) ───────────────────────────────────────────────────

export function YStack({ gap, align, justify, wrap, className, style, ...props }: StackProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col',
        align && alignMap[align],
        justify && justifyMap[justify],
        wrap && 'flex-wrap',
        className,
      )}
      style={buildStackStyle(gap, style)}
      {...props}
    />
  )
}

/** Alias for YStack — matches SwiftUI naming */
export const VStack = YStack

// ── Horizontal stack (row) ────────────────────────────────────────────────────

export function XStack({ gap, align, justify, wrap, className, style, ...props }: StackProps) {
  return (
    <div
      className={cn(
        'flex flex-row',
        align && alignMap[align],
        justify && justifyMap[justify],
        wrap && 'flex-wrap',
        className,
      )}
      style={buildStackStyle(gap, style)}
      {...props}
    />
  )
}

/** Alias for XStack — matches SwiftUI naming */
export const HStack = XStack

// ── Z stack (layered) ─────────────────────────────────────────────────────────

interface ZStackProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end'
}

const zAlignMap: Record<NonNullable<ZStackProps['align']>, string> = {
  start: 'place-items-start',
  center: 'place-items-center',
  end: 'place-items-end',
}

/**
 * Layers children on top of each other using CSS grid.
 * Each child occupies the same grid cell — no absolute positioning needed.
 */
export function ZStack({ align = 'center', className, children, ...props }: ZStackProps) {
  return (
    <div className={cn('grid', zAlignMap[align], className)} {...props}>
      {React.Children.map(children, (child, i) => (
        <div key={i} style={{ gridArea: '1 / 1' }}>
          {child}
        </div>
      ))}
    </div>
  )
}
