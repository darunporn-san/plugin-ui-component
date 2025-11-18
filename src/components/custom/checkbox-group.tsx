import * as React from "react"
import { Checkbox } from "../ui/checkbox"
import { cn } from "@/lib/utils"

type Option = {
  value: string
  label: string
  disabled?: boolean
}

export interface CheckboxGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  options: Option[]
  value?: string[]
  onValueChange?: (selectedValues: string[]) => void
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
}

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({
    options,
    value = [],
    onValueChange,
    className,
    disabled = false,
    orientation = 'vertical',
    ...props
  }, ref) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(value)

  React.useEffect(() => {
    setSelectedValues(value)
  }, [value])

  const handleChange = (optionValue: string, checked: boolean) => {
    const newSelectedValues = checked
      ? [...selectedValues, optionValue]
      : selectedValues.filter((v) => v !== optionValue)

    setSelectedValues(newSelectedValues)
    onValueChange?.(newSelectedValues)
  }

    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-4',
          orientation === 'vertical' ? 'flex-col' : 'flex-wrap',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex items-center space-x-2',
              (disabled || option.disabled) && 'cursor-not-allowed opacity-70',
              'cursor-pointer select-none'
            )}
          >
            <Checkbox
              id={option.value}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) => handleChange(option.value, checked === true)}
              disabled={disabled || option.disabled}
            />
            <span className="text-sm font-medium leading-none">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    )
  }
)

CheckboxGroup.displayName = 'CheckboxGroup'
