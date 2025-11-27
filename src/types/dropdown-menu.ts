import { ReactNode } from "react"

export type MenuItem = {
  /** Text to display for the menu item */
  label: string
  /** Callback when the menu item is clicked */
  onClick?: () => void
  /** Whether the menu item is disabled */
  disabled?: boolean
  /** Optional icon to display before the label */
  icon?: React.ReactNode
  /** Whether to show a separator after this item */
  withSeparator?: boolean
}

export type DropdownMenuProps = {
  /** Text to display on the dropdown button */
  buttonText: string
  /** Array of menu items to display in the dropdown */
  items: MenuItem[]
  /** Additional class name for the dropdown button */
  className?: string
  /** Additional class name for the dropdown content */
  contentClassName?: string
  /** Variant of the button */
  variant?: "default" | "outline" | "ghost" | "link" | "secondary"
  /** Size of the button */
  size?: "default" | "sm" | "lg" | "icon"
  /** Whether the dropdown should be open by default */
  defaultOpen?: boolean
  /** Whether the dropdown is open (controlled) */
  open?: boolean
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void
}

