import { ButtonProps } from "@/components/ui/button"
import { VariantProps } from "class-variance-authority"
import { customButtonVariants } from "@/components/custom/custom-button"

export type CustomVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost' | 'link'

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
  errors?: any
  fetchErrors?: () => Promise<any>
}
