import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"

const customButtonVariants = cva("", {
  variants: {
    variant: {
      primary: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600",
      secondary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600",
      success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600",
      warning: "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600",
      danger: "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600",
      outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "underline-offset-4 hover:underline text-primary",
    },
    size: {
      sm: "h-9 px-3 text-sm",
      default: "h-10 py-2 px-4",
      lg: "h-11 px-8 text-lg",
      xl: "h-14 px-10 text-xl",
      icon: "h-10 w-10",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    },
    shadow: {
      none: "shadow-none",
      sm: "shadow-sm",
      default: "shadow",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
      inner: "shadow-inner",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
    rounded: "lg",
    shadow: "default",
  },
})

type CustomVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost' | 'link'

export interface CustomButtonProps
  extends Omit<ButtonProps, 'variant' | 'size'>,
    VariantProps<typeof customButtonVariants> {
  asChild?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
  fullWidth?: boolean
  confirmTitle?: React.ReactNode
  confirmMessage?: React.ReactNode
  confirmActionText?: React.ReactNode
  confirmCancelText?: React.ReactNode
  onConfirm?: (event: React.MouseEvent<HTMLElement>) => void
  onCancel?: (event: React.MouseEvent<HTMLElement>) => void
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      rounded = 'lg',
      shadow = 'default',
      asChild = false,
      leftIcon,
      rightIcon,
      isLoading = false,
      fullWidth = false,
      children,
      confirmTitle,
      confirmMessage,
      confirmActionText = "Confirm",
      confirmCancelText = "Cancel",
      onConfirm,
      onCancel,
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showConfirm, setShowConfirm] = React.useState(false)
    const pendingActionRef = React.useRef<(() => void) | null>(null)

    const handleClose = React.useCallback(() => {
      setShowConfirm(false)
      pendingActionRef.current = null
    }, [])

    const handleCancel = React.useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        handleClose()
        onCancel?.(event)
      },
      [handleClose, onCancel]
    )

    const handleConfirm = React.useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        const action = pendingActionRef.current
        handleClose()
        action?.()
        onConfirm?.(event)
      },
      [handleClose, onConfirm]
    )

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        if (isLoading || disabled) {
          return
        }

        if (confirmMessage || confirmTitle) {
          event.preventDefault()
          event.stopPropagation()
          if ("persist" in event) {
            event.persist()
          }
          pendingActionRef.current = () => {
            onClick?.(event as React.MouseEvent<HTMLButtonElement>)
          }
          setShowConfirm(true)
          return
        }

        onClick?.(event as React.MouseEvent<HTMLButtonElement>)
      },
      [confirmMessage, confirmTitle, disabled, isLoading, onClick]
    )
    
    return (
      <>
        <Button
          className={cn(
            customButtonVariants({ variant: variant as CustomVariant, size, rounded, shadow }),
            fullWidth && "w-full",
            isLoading && "pointer-events-none opacity-70",
            className
          )}
          ref={ref}
          disabled={disabled || isLoading}
          onClick={handleClick}
          variant={variant === 'default' ? 'default' : (variant as any)}
          size={size as any}
          {...props}
        >
          {isLoading && (
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          <span className={cn("flex items-center gap-2", isLoading && "invisible")}>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </span>
        </Button>
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              {confirmTitle && (
                <DialogTitle id="custom-button-confirm-title">
                  {confirmTitle}
                </DialogTitle>
              )}
              <DialogDescription id="custom-button-confirm-description">
                {confirmMessage ?? "Are you sure you want to continue?"}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={(event) => handleCancel(event as React.MouseEvent<HTMLElement>)}
              >
                {confirmCancelText}
              </Button>
              <Button
                onClick={(event) => handleConfirm(event as React.MouseEvent<HTMLElement>)}
              >
                {confirmActionText}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }
)

CustomButton.displayName = "CustomButton"

export { CustomButton, customButtonVariants }
