import * as React from "react"
import { Card as CardPrimitive, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives/card"
import { cn } from "@/lib/utils"

interface CardProps {
  /** Main title rendered in the card header */
  title?: React.ReactNode
  /** Content rendered before the title in the header (e.g. a prompt label) */
  headerPre?: React.ReactNode
  /** Content rendered after the title in the header (e.g. helper text) */
  headerPost?: React.ReactNode
  /** Content rendered to the right of the title in a flex-between row (e.g. a badge, toggle, or info span) */
  headerExtra?: React.ReactNode
  /** Content inside the card body */
  children: React.ReactNode
  /** className forwarded to the root Card element (e.g. custom border or background) */
  className?: string
}

export function Card({ title, headerPre, headerPost, headerExtra, children, className }: CardProps) {
  const hasHeader =
    title != null || headerPre != null || headerPost != null || headerExtra != null

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
          {headerPost}
        </CardHeader>
      )}
      <CardContent className={cn("space-y-2", !hasHeader && "pt-6")}>
        {children}
      </CardContent>
    </CardPrimitive>
  )
}
