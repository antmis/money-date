import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { XStack } from "./stack"

// ─── ListGroup ────────────────────────────────────────────────────────────────

const listGroupVariants = cva(
  "flex flex-col divide-y divide-border",
  {
    variants: {
      variant: {
        default: "",
        outlined: "overflow-hidden rounded-lg border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function ListGroup({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof listGroupVariants>) {
  return (
    <div
      role="list"
      data-slot="list-group"
      className={cn("w-full", listGroupVariants({ variant, className }))}
      {...props}
    />
  )
}

// ─── ListItem variants ────────────────────────────────────────────────────────

const listItemVariants = cva(
  "group/list-item flex w-full flex-row items-center outline-none transition-colors duration-100",
  {
    variants: {
      size: {
        sm: "min-h-[40px] gap-2 px-3 py-2 text-xs",
        default: "min-h-[48px] gap-3 py-2.5 text-sm",
        lg: "min-h-[56px] gap-3.5 px-5 py-3 text-sm",
      },
      variant: {
        default: "bg-transparent",
        muted: "bg-muted/50",
        ghost: "bg-transparent",
      },
      pressable: {
        true: "cursor-pointer select-none hover:bg-accent/50 active:bg-accent/70 focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:ring-offset-1",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      pressable: false,
    },
  }
)

// ─── Sub-components ───────────────────────────────────────────────────────────

function ListItemIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-icon"
      className={cn(
        "flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5",
        "group-has-[[data-slot=list-item-subtitle]]/list-item:self-start group-has-[[data-slot=list-item-subtitle]]/list-item:translate-y-0.5",
        className
      )}
      {...props}
    />
  )
}

function ListItemIconAfter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-icon-after"
      className={cn(
        "ml-auto flex shrink-0 items-center justify-center text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5",
        "group-has-[[data-slot=list-item-subtitle]]/list-item:self-start group-has-[[data-slot=list-item-subtitle]]/list-item:translate-y-0.5",
        className
      )}
      {...props}
    />
  )
}

function ListItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-content"
      className={cn("flex flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function ListItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-title"
      className={cn("font-medium leading-snug", className)}
      {...props}
    />
  )
}

function ListItemSubtitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="list-item-subtitle"
      className={cn(
        "text-muted-foreground line-clamp-2 text-xs font-normal leading-normal",
        className
      )}
      {...props}
    />
  )
}

// Right-aligned value shown on the same row as the title (line item style)
function ListItemValue({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-value"
      className={cn(
        "ml-auto text-right text-muted-foreground text-xs font-normal leading-normal tabular-nums",
        className
      )}
      {...props}
    />
  )
}

// ─── ListItem ─────────────────────────────────────────────────────────────────

interface ListItemProps
  extends Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof listItemVariants> {
  title?: React.ReactNode
  subTitle?: React.ReactNode
  /** Right-aligned value rendered inline with the title (line item style) */
  lineItem?: React.ReactNode
  icon?: React.ElementType
  iconAfter?: React.ElementType
  asChild?: boolean
}

function ListItem({
  className,
  size,
  variant,
  pressable,
  title,
  subTitle,
  lineItem,
  icon: Icon,
  iconAfter: IconAfter,
  asChild = false,
  children,
  ...props
}: ListItemProps) {
  const Comp = asChild ? Slot : "div"
  const hasConvenienceContent = title != null || subTitle != null || lineItem != null

  return (
    <Comp
      role="listitem"
      data-slot="list-item"
      className={cn(listItemVariants({ size, variant, pressable, className }))}
      {...props}
    >
      {Icon && (
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
      )}
      {hasConvenienceContent && (
        <ListItemContent>
          {(title != null || lineItem != null) && (
            <XStack gap={1} align="center">
              {title != null && <ListItemTitle>{title}</ListItemTitle>}
              {lineItem != null && <ListItemValue>{lineItem}</ListItemValue>}
            </XStack>
          )}
          {subTitle != null && <ListItemSubtitle>{subTitle}</ListItemSubtitle>}
        </ListItemContent>
      )}
      {children}
      {IconAfter && (
        <ListItemIconAfter>
          <IconAfter />
        </ListItemIconAfter>
      )}
    </Comp>
  )
}

// Attach sub-components as static properties (Tamagui-style API)
ListItem.Title = ListItemTitle
ListItem.Subtitle = ListItemSubtitle
ListItem.Value = ListItemValue
ListItem.Icon = ListItemIcon
ListItem.IconAfter = ListItemIconAfter
ListItem.Content = ListItemContent
ListItem.Group = ListGroup

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  ListItem,
  ListGroup,
  ListItemTitle,
  ListItemSubtitle,
  ListItemValue,
  ListItemIcon,
  ListItemIconAfter,
  ListItemContent,
}
