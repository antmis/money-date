import * as React from "react"
import type { VariantProps } from "class-variance-authority"

import {
  ItemRoot,
  ItemIcon,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemHeader,
  ItemFooter,
  itemRootVariants,
} from "@/ui/primitives/item"

// Re-export primitives for direct composition
export {
  ItemRoot,
  ItemIcon,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemHeader,
  ItemFooter,
}

// ─── Composed Item ────────────────────────────────────────────────────────────

interface ItemProps
  extends Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof itemRootVariants> {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
  asChild?: boolean
}

function Item({
  title,
  description,
  icon,
  action,
  variant,
  size,
  children,
  ...props
}: ItemProps) {
  const hasConvenienceContent = title != null || description != null || icon != null || action != null

  return (
    <ItemRoot variant={variant} size={size} {...props}>
      {hasConvenienceContent ? (
        <>
          {icon != null && <ItemIcon>{icon}</ItemIcon>}
          {(title != null || description != null) && (
            <ItemContent>
              {title != null && <ItemTitle>{title}</ItemTitle>}
              {description != null && <ItemDescription>{description}</ItemDescription>}
            </ItemContent>
          )}
          {action != null && <ItemActions>{action}</ItemActions>}
          {children}
        </>
      ) : (
        children
      )}
    </ItemRoot>
  )
}

// Attach sub-components as static properties
Item.Icon = ItemIcon
Item.Content = ItemContent
Item.Title = ItemTitle
Item.Description = ItemDescription
Item.Actions = ItemActions
Item.Group = ItemGroup
Item.Header = ItemHeader
Item.Footer = ItemFooter
Item.Separator = ItemSeparator

export { Item }
