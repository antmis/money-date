import { TooltipPrimitive, TooltipContent, TooltipTrigger } from '@/ui/primitives/tooltip-primitive'
import { Button, Typography } from '@/ui'

interface ToolTipProps {
  description: string
}

export function Tooltip({ description }: ToolTipProps) {
  return (
    <TooltipPrimitive>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon-sm" className="h-4 w-4 ml-2">
          <Typography variant="small">i</Typography>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <Typography variant="caption">{description}</Typography>
      </TooltipContent>
    </TooltipPrimitive>
  )
}
