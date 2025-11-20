import * as React from "react"
import {
  DropdownMenu as BaseDropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type MenuItem = {
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

type DropdownMenuProps = {
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

/**
 * A simple dropdown menu component that takes a button text and an array of menu items
 */
const CustomDropdownMenu = React.forwardRef<HTMLButtonElement, DropdownMenuProps>((props, ref) => {
  const {
    buttonText,
    items,
    className,
    contentClassName,
    variant = "outline",
    size = "default",
    defaultOpen,
    open,
    onOpenChange
  } = props;

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, [buttonText, className]);

  return (
    <BaseDropdownMenu
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className} 
          ref={node => {
            // Forward the ref
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              // Use Object.defineProperty to handle both mutable and immutable refs
              Object.defineProperty(ref, 'current', {
                value: node,
                writable: true,
              });
            }
            // Set the button ref for width measurement using Object.defineProperty
            if (buttonRef) {
              Object.defineProperty(buttonRef, 'current', {
                value: node,
                writable: true,
              });
            }
          }}
        >
          {buttonText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className={cn(contentClassName)} 
        style={{ minWidth: buttonWidth }}
        align="end"
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <DropdownMenuItem 
              onClick={item.onClick}
              disabled={item.disabled}
              className="flex items-center gap-2"
            >
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </DropdownMenuItem>
            {item.withSeparator && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </BaseDropdownMenu>
  );
});

CustomDropdownMenu.displayName = "CustomDropdownMenu";

export { CustomDropdownMenu };
export default CustomDropdownMenu;
