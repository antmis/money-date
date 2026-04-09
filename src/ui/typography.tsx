import { cn } from '@/lib/utils'
import React from 'react'

const variants = {
  heading:    'text-xl font-semibold tracking-tight',
  body:       'text-sm',
  prose:      'text-sm leading-relaxed',
  blockquote: 'text-sm text-muted-foreground mt-6 border-l-2 pl-6 italic',
  label:      'text-sm font-medium',
  muted:      'text-sm text-muted-foreground',
  small:      'text-xs text-muted-foreground',
  caption:    'text-xs font-medium text-muted-foreground',
  meta:       'text-xs font-medium uppercase tracking-wide text-muted-foreground',
  amount:     'text-sm font-semibold tabular-nums',
  amountLg:   'text-xl font-bold tabular-nums',
  value:      'text-2xl font-semibold',
  display:    'text-4xl font-bold',
  brand:      'text-sm font-semibold tracking-tight',
} as const

const colors = {
  default:    '',
  foreground: 'text-foreground',
  muted:      'text-muted-foreground',
  warning:    'text-amber-600 dark:text-amber-400',
  caution:    'text-amber-500',
  danger:     'text-red-500',
  success:    'text-green-600 dark:text-green-400',
  deduction:  'text-red-500',
  savings:    'text-blue-500',
  giving:     'text-green-600',
  goals:      'text-purple-500',
} as const

export type TypographyVariant = keyof typeof variants
export type TypographyColor = keyof typeof colors

type As = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'label'

const defaultAs: Record<TypographyVariant, As> = {
  heading:    'h2',
  body:       'p',
  prose:      'p',
  blockquote: 'p',
  label:      'p',
  muted:      'p',
  small:      'p',
  caption:    'p',
  meta:       'p',
  amount:     'span',
  amountLg:   'span',
  value:      'p',
  display:    'p',
  brand:      'span',
}

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant
  color?: TypographyColor
  as?: As
  numeric?: boolean
  htmlFor?: string
}

export function Typography({
  variant = 'body',
  color = 'default',
  as,
  numeric,
  className,
  htmlFor,
  children,
  ...props
}: TypographyProps) {
  const tag = as ?? defaultAs[variant]
  const Tag = tag as React.ElementType
  return (
    <Tag
      className={cn(variants[variant], colors[color], numeric && 'tabular-nums', className)}
      {...(tag === 'label' && htmlFor ? { htmlFor } : {})}
      {...props}
    >
      {children}
    </Tag>
  )
}
