import * as React from "react"
import {
  Dialog as DialogPrimitive,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/ui/primitives/dialog"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Dialog heading */
  title: React.ReactNode
  /** Optional subtext beneath the title */
  description?: React.ReactNode
  /** If provided, rendered as the dialog trigger (wrapped in asChild) */
  trigger?: React.ReactNode
  /** Optional footer content (e.g. action buttons) */
  footer?: React.ReactNode
  /** Dialog body content */
  children?: React.ReactNode
  /** className forwarded to DialogContent (e.g. for custom max-width or scroll) */
  className?: string
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  footer,
  children,
  className,
}: DialogProps) {
  return (
    <DialogPrimitive open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={className} aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 pb-8 pt-4">
          {children}
        </div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </DialogPrimitive>
  )
}
