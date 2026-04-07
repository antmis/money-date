import * as React from "react"
import { cn } from "@/lib/utils"

interface FieldProps {
  children: React.ReactNode
  className?: string
}

export function Field({ children, className }: FieldProps) {
  return (
    <div className={cn("w-full space-y-2", className)}>
      {children}
    </div>
  )
}
