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
import { DropdownMenuProps } from "@/types/dropdown-menu"
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
