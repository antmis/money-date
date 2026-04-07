import * as React from "react"
import { cn } from "@/lib/utils"

interface FieldRowProps {
  children: React.ReactNode
  className?: string
}

export function FieldRow({ children, className }: FieldRowProps) {
  return (
    <div className={cn("flex flex-row space-x-2", className)}>
      {children}
    </div>
  )
}
