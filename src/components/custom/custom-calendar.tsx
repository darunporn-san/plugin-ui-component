"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar as BaseCalendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CustomCalendarProps {
  /** Additional class name */
  className?: string
  /** The selected date */
  selected?: Date | null
  /** The selected date (alternative to 'selected') */
  value?: Date | null
  /** Callback when date is selected */
  onSelect?: (date: Date | undefined) => void
  /** Callback when date is selected (alternative to 'onSelect') */
  onChange?: (date: Date | undefined) => void
  /** Label for the date picker */
  label?: string
  /** Description text */
  description?: string
  /** Placeholder text for the input */
  placeholder?: string
}

const formatDate = (date: Date | null | undefined) => {
  return date ? format(date, "PPP") : ""
}

const parseInputDate = (value: string): Date | undefined => {
  if (!value) return undefined
  try {
    return parse(value, "yyyy-MM-dd", new Date())
  } catch {
    return undefined
  }
}

/**
 * A simple and customizable calendar component
 */
const CustomCalendar = React.forwardRef<HTMLDivElement, CustomCalendarProps>(({
  className,
  selected,
  value,
  onSelect,
  onChange,
  label,
  description,
  placeholder = "Select a date from the calendar",
  ...rest
}, ref) => {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [date, setDate] = React.useState<Date | undefined>(value ?? selected ?? undefined)
  const [month, setMonth] = React.useState<Date | undefined>(date)
  
  // Use onChange if provided, otherwise fall back to onSelect
  const handleChange = onChange ?? onSelect

  React.useEffect(() => {
    setDate(value ?? selected ?? undefined)
    setMonth(value ?? selected ?? undefined)
    const dateToFormat = value ?? selected;
    setInputValue(dateToFormat ? formatDate(dateToFormat) : "")
  }, [value, selected])

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    setInputValue(newDate ? formatDate(newDate) : "")
    handleChange?.(newDate)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    const parsedDate = parseInputDate(value)
    if (parsedDate) {
      setDate(parsedDate)
      setMonth(parsedDate)
      handleChange?.(parsedDate)
    } else if (!value) {
      setDate(undefined)
      handleChange?.(undefined)
    }
  }

  return (
    <div ref={ref} className={cn("w-full space-y-2", className)}>
      <div className="relative flex gap-2">
        <Input
          id="date-picker"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Select a date from the calendar"
          readOnly
          className="bg-background pr-10"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              setOpen(false)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => {
                if (date) {
                  handleSelect(undefined);
                  setInputValue("");
                } else {
                  setOpen(!open);
                }
              }}
            >
              {date ? (
                <X className="h-4 w-4" />
              ) : (
                <CalendarIcon className="h-4 w-4" />
              )}
              <span className="sr-only">{date ? 'Clear date' : 'Select date'}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <BaseCalendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              month={month}
              onMonthChange={setMonth}
              className="rounded-md border shadow-sm"
              captionLayout="dropdown"
              {...rest}
            />
          </PopoverContent>
        </Popover>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">
          {date ? `Selected: ${format(date, "PPP")}` : description}
        </p>
      )}
    </div>
  )
})

CustomCalendar.displayName = "CustomCalendar"

export { CustomCalendar }
