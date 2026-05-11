import { Button } from '@/ui/button'
import { Dialog } from '@/ui/dialog'
import { XStack } from '@/ui/stack'

interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  description?: string
  confirmLabel?: string
}

export function ConfirmDeleteDialog({ open, onOpenChange, onConfirm, description, confirmLabel = 'Delete' }: ConfirmDeleteDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Confirm ${confirmLabel}`}
      description={description ?? 'This action cannot be undone.'}
      className="max-w-sm"
      footer={
        <XStack gap={2} className="justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => { onConfirm(); onOpenChange(false) }}>{confirmLabel}</Button>
        </XStack>
      }
    />
  )
}
