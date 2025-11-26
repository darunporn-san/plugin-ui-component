"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as BaseCalendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  FieldError,
} from "react-hook-form";

interface CustomCalendarProps<T extends FieldValues> {
  className?: string;
  selected?: Date | DateRange;
  onSelect?: (value: Date | DateRange | undefined) => void;
  label?: string;
  mode?: "single" | "range";
  control?: any;
  name?: Path<T>;
  error?: FieldError;
  required?: boolean;
}

// 💡 Combined Wrapper + Popover Component
interface CalendarBoxProps {
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
  label?: string;
  required?: boolean;
  error?: FieldError;
  displayText: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

const CalendarBox = React.forwardRef<HTMLDivElement, CalendarBoxProps>(
  (
    { className, label, required, error, displayText, open, setOpen, children },
    ref
  ) => (
    <div ref={ref} className={cn("w-full space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal",
              !displayText && "text-muted-foreground"
            )}
          >
            {displayText}
            <CalendarIcon className="mr-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="center">
          {children}
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-sm font-medium text-destructive">
          {error.message || "This field is required"}
        </p>
      )}
    </div>
  )
);

CalendarBox.displayName = "CalendarBox";
const CustomCalendar = React.forwardRef<
  HTMLDivElement,
  CustomCalendarProps<any>
>(
  (
    {
      mode = "single",
      className,
      selected: externalSelected,
      onSelect: externalOnSelect,
      label = "Date",
      control,
      name,
      error,
      required = false,
      ...rest
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | DateRange | undefined>(
      externalSelected
    );
    const [tempDate, setTempDate] = React.useState<DateRange | undefined>(
      mode === "range"
        ? (externalSelected as DateRange) || { from: undefined, to: undefined }
        : undefined
    );


    React.useEffect(() => {
      if (open) {
        console.log("open", tempDate, date);
        if (!date) return;

        // Narrow the type to DateRange
        if ("from" in date && "to" in date) {
          if (
            !tempDate ||
            (("from" in tempDate && "to" in tempDate) &&
              (tempDate.from !== date.from || tempDate.to !== date.to))
          ) {
            setTempDate(date as DateRange);
          }
        }
      }
    }, [open]);

    // Sync states when externalSelected changes
    React.useEffect(() => {
      setDate(externalSelected);
      console.log("externalSelected", externalSelected);

      if (mode === "range") {
        setTempDate(
          (externalSelected as DateRange) || { from: undefined, to: undefined }
        );
      }
    }, [externalSelected, mode]);

    // Update display text when date changes
    const displayText = React.useMemo(() => {
      if (mode === "range") {
        const range = date as DateRange;
        if (range?.from && range?.to) {
          return `${format(range.from, "PPP")} - ${format(range.to, "PPP")}`;
        } else if (range?.from) {
          return `${format(range.from, "PPP")} - ...`;
        }
        return "Pick a date range";
      }
      return date ? format(date as Date, "PPP") : "Pick a date";
    }, [date, mode]);

    const handleChange = React.useCallback(
      (value: Date | DateRange | undefined) => {
        setDate(value);
        externalOnSelect?.(value);
      },
      [externalOnSelect]
    );

    const renderCalendar = (
      value?: Date | DateRange,
      onChange?: (v: any) => void
    ) => {
      // console.log("renderCalendar", value, tempDate);
      const handleApply = () => {
        if (mode === "range" && tempDate?.from && tempDate?.to) {
          const newValue = { from: tempDate.from, to: tempDate.to };
          handleChange(newValue);
          onChange?.(newValue);
        } else if (mode === "single" && tempDate?.from) {
          handleChange(tempDate.from);
          onChange?.(tempDate.from);
        } else {
          const newValue =
            mode === "range" ? { from: undefined, to: undefined } : undefined;
          handleChange(newValue);
          onChange?.(newValue);
        }
        setOpen(false);
      };

      const handleReset = () => {
        const newValue =
          mode === "range" ? { from: undefined, to: undefined } : undefined;
        setTempDate(newValue);
        handleChange(newValue);
        onChange?.(newValue);
      };
      if (mode === "range") {
        return (
          <>
            <BaseCalendar
              mode="range"
              selected={tempDate as DateRange | undefined}
              onSelect={(v: DateRange | undefined) => setTempDate(v)}
              numberOfMonths={2}
              captionLayout="dropdown"
              required={required}
              {...rest}
            />
            <div className="border-t flex p-1 space-x-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  // Reset to original value when canceling
                  setTempDate(
                    (date as DateRange) || { from: undefined, to: undefined }
                  );
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button variant="outline" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </>
        );
      }

      return (
        <BaseCalendar
          mode="single"
          selected={value as Date | undefined}
          onSelect={(v: Date | undefined) => {
            onChange?.(v);
            handleChange(v);
            setOpen(false);
          }}
          captionLayout="dropdown"
          required={required}
          {...rest}
        />
      );
    };

    // 🔐 Controlled Mode with RHF
    if (control && name) {
      return (
        <Controller
          control={control}
          name={name}
          rules={{ required }}
          render={({ field: { value, onChange } }) => (
            <CalendarBox
              ref={ref}
              className={className}
              label={label}
              required={required}
              error={error}
              displayText={displayText}
              open={open}
              setOpen={setOpen}
            >
              {renderCalendar(value, onChange)}
            </CalendarBox>
          )}
        />
      );
    }

    // Format date for display
    const getDisplayText = (date: Date | DateRange | undefined): string => {
      if (!date) return "";

      if (date instanceof Date) {
        return format(date, "PPP");
      }

      if (date?.from && date?.to) {
        return `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`;
      }

      return format(date?.from || new Date(), "PPP");
    };

    // 🔓 Non-Controlled Mode
    return (
      <CalendarBox
        ref={ref}
        className={className}
        label={label}
        required={required}
        error={error}
        displayText={getDisplayText(date)}
        open={open}
        setOpen={setOpen}
      >
        {open && renderCalendar(date)}
      </CalendarBox>
    );
  }
);

CustomCalendar.displayName = "CustomCalendar";
export { CustomCalendar };
