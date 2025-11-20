"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar as BaseCalendar } from "@/components/ui/calendar"
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
  /** Callback when date is selected */
  onSelect?: (date: Date | undefined) => void
  /** Label for the date picker */
  label?: string
  /** Description text */
  description?: string
}

/**
 * A simple and customizable calendar component
 */
const CustomCalendar = React.forwardRef<HTMLDivElement, CustomCalendarProps>(({
  className,
  selected,
  onSelect,
  label = "Date",
  description = "Select a date",
  ...rest
}, ref) => {
  const [date, setDate] = React.useState<Date | undefined>(selected || undefined)

  React.useEffect(() => {
    setDate(selected || undefined)
  }, [selected])

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    onSelect?.(newDate)
  }

  return (
    <div ref={ref} className={cn("w-full space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="mr-2 h-4 w-4" />

          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <BaseCalendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm"
            captionLayout="dropdown"
            {...rest}
          />
        </PopoverContent>
      </Popover>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
})

CustomCalendar.displayName = "CustomCalendar"

export { CustomCalendar }
