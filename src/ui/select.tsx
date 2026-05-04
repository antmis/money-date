import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover"
import { Button, Input } from "@/ui"
import { cn } from "@/lib/utils"

type SelectOption = string | { value: string; label: React.ReactNode }

// 1. Update SelectGroupOption to allow readonly arrays
export interface SelectGroupOption {
  readonly label: string
  readonly options: readonly SelectOption[]
}

interface SelectProps {
  value?: string
  onValueChange: (value: string) => void
  // 2. Allow the options array to be readonly as well
  options: readonly SelectOption[] | readonly SelectGroupOption[]
  placeholder?: string
  className?: string
}

export function Select({ value, onValueChange, options, placeholder = "Select...", className }: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  const isGrouped = options.length > 0 && typeof options[0] === 'object' && 'options' in options[0]

  // Flatten options to find the active display label
  const flatOptions = React.useMemo(() => {
    if (isGrouped) {
      return (options as SelectGroupOption[]).flatMap(g => g.options)
    }
    return options as SelectOption[]
  }, [options, isGrouped])

  const selectedOption = flatOptions.find(opt => {
    const val = typeof opt === 'string' ? opt : opt.value
    return val === value
  })

  const displayLabel = selectedOption 
    ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label)
    : placeholder

  // Filter groups or flat options in-memory
  const filteredGroups = React.useMemo(() => {
    if (!searchTerm) return options

    if (isGrouped) {
      return (options as SelectGroupOption[]).map(group => ({
        ...group,
        options: group.options.filter(opt => {
          const val = typeof opt === 'string' ? opt : opt.value
          const lbl = typeof opt === 'string' ? opt : String(opt.label)
          return val.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 lbl.toLowerCase().includes(searchTerm.toLowerCase())
        })
      })).filter(group => group.options.length > 0)
    }

    return (options as SelectOption[]).filter(opt => {
      const val = typeof opt === 'string' ? opt : opt.value
      const lbl = typeof opt === 'string' ? opt : String(opt.label)
      return val.toLowerCase().includes(searchTerm.toLowerCase()) || 
             lbl.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [options, searchTerm, isGrouped])

  function handleSelect(val: string) {
    onValueChange(val)
    setOpen(false)
    setSearchTerm("")
  }

  return (
    <Popover open={open} onOpenChange={(next) => { setOpen(next); if (!next) setSearchTerm(""); }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("flex h-9 w-full items-center justify-between px-3 py-2 text-base font-normal shadow-sm", className)}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      
      {/* Target full trigger width via CSS variable if using standard Radix setups */}
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[200px] p-1 max-h-[300px] overflow-y-auto" align="start">
        <div className="p-1">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 text-sm mb-1"
          />
        </div>
        
        {isGrouped ? (
          (filteredGroups as SelectGroupOption[]).map((group, idx) => (
            <div key={group.label || idx}>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{group.label}</div>
              {group.options.map(opt => renderItem(opt, value, handleSelect))}
            </div>
          ))
        ) : (
          (filteredGroups as SelectOption[]).map(opt => renderItem(opt, value, handleSelect))
        )}
        
        {filteredGroups.length === 0 && (
          <div className="py-2 text-center text-sm text-muted-foreground">No results found.</div>
        )}
      </PopoverContent>
    </Popover>
  )
}

function renderItem(opt: SelectOption, currentValue: string | undefined, onSelect: (val: string) => void) {
  const val = typeof opt === 'string' ? opt : opt.value
  const label = typeof opt === 'string' ? opt : opt.label
  const isSelected = val === currentValue

  return (
    <button
      key={val}
      type="button"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-left",
        isSelected && "bg-accent/50 font-medium"
      )}
      onClick={() => onSelect(val)}
    >
      <span className="truncate flex-1">{label}</span>
      {isSelected && (
        <span className="absolute right-2 flex items-center justify-center">
          <Check className="h-4 w-4" />
        </span>
      )}
    </button>
  )
}
