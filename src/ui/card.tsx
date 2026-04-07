import * as React from "react"
import { Card as CardPrimitive, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/primitives/card"
import { cn } from "@/lib/utils"

interface CardProps {
  /** Main title rendered in the card header */
  title?: React.ReactNode
  /** Description rendered below the title in the card header */
  description?: React.ReactNode
  /** Content rendered before the title in the header (e.g. a prompt label) */
  headerPre?: React.ReactNode
  /** Content rendered after the title in the header (e.g. helper text) */
  headerPost?: React.ReactNode
  /** Content rendered to the right of the title in a flex-between row (e.g. a badge, toggle, or info span) */
  headerExtra?: React.ReactNode
  /** Content inside the card body */
  children: React.ReactNode
  /** Content rendered in the card footer (e.g. action buttons, links) */
  footer?: React.ReactNode
  /** className forwarded to the root Card element (e.g. custom border or background) */
  className?: string
}

export function Card({ title, description, headerPre, headerPost, headerExtra, footer, children, className }: CardProps) {
  const hasHeader =
    title != null || description != null || headerPre != null || headerPost != null || headerExtra != null

  return (
    <CardPrimitive className={className}>
      {hasHeader && (
        <CardHeader>
          {headerPre}
          {headerExtra ? (
            <div className="flex items-center justify-between">
              {title != null && <CardTitle className="text-base">{title}</CardTitle>}
              {headerExtra}
            </div>
          ) : (
            title != null && <CardTitle className="text-base">{title}</CardTitle>
          )}
          {description != null && <CardDescription>{description}</CardDescription>}
          {headerPost}
        </CardHeader>
      )}
      <CardContent className={cn("space-y-2", !hasHeader && "pt-6")}>
        {children}
      </CardContent>
      {footer != null && <CardFooter>{footer}</CardFooter>}
    </CardPrimitive>
  )
}
