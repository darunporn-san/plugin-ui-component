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
  control?:any;
  name?: Path<T>;
  error?: FieldError;
  required?: boolean;
}

const CustomCalendar = React.forwardRef<HTMLDivElement, CustomCalendarProps<any>>(
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
    // 📌 Local States
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | DateRange | undefined>(externalSelected);
    const [tempDate, setTempDate] = React.useState<DateRange | undefined>(
      (externalSelected as DateRange) || undefined
    );

    // 🔄 Update from outside
    React.useEffect(() => {
      setDate(externalSelected);
      if (mode === "range") setTempDate(externalSelected as DateRange);
    }, [externalSelected, mode]);

    // 🔹 Unified handler (for both modes + RHF)
    const handleChange = React.useCallback(
      (value: Date | DateRange | undefined) => {
        setDate(value);
        externalOnSelect?.(value);
      },
      [externalOnSelect]
    );

    // 🧠 Display Text
    const getDisplayText = (value?: Date | DateRange) => {
      if (!value) return mode === "range" ? "Pick a date range" : "Pick a date";

      if (mode === "range") {
        const range = value as DateRange;
        if (range.from && range.to) return `${format(range.from, "PPP")} - ${format(range.to, "PPP")}`;
        if (range.from) return `${format(range.from, "PPP")} - ...`;
        return "Pick a date range";
      }

      return format(value as Date, "PPP");
    };

    // 🧩 Render Calendar UI (both modes)
    const renderCalendar = (
      value?: Date | DateRange,
      onChange?: (v: any) => void
    ) => {
      if (mode === "range") {
        return (
          <>
            <BaseCalendar
              mode="range"
              selected={tempDate as DateRange | undefined}
              onSelect={(v: DateRange | undefined) => {
                setTempDate(v);
              }}
              numberOfMonths={2}
              captionLayout="dropdown"
              required={required}
              {...rest}
            />
            <div className="border-t flex p-1 space-x-2 justify-end">
              <Button variant="outline" onClick={() => setTempDate(undefined)}>
                Reset
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onChange?.(tempDate);
                  handleChange(tempDate);
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </>
        );
      }

      // 🧠 Single mode
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


    // 🔐 RHF Controlled mode
    if (control && name) {
      return (
        <Controller
          control={control}
          name={name}
          rules={{ required }}
          render={({ field: { value, onChange } }) => (
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
                      !value && "text-muted-foreground"
                    )}
                  >
                    {getDisplayText(value)}
                    <CalendarIcon className="mr-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="center">
                  {renderCalendar(value, onChange)}
                </PopoverContent>
              </Popover>

              {error && (
                <p className="text-sm font-medium text-destructive">
                  {error.message || "This field is required"}
                </p>
              )}
            </div>
          )}
        />
      );
    }

    // 🔓 Non-controlled mode
    return (
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
                !date && "text-muted-foreground"
              )}
            >
              {getDisplayText(date)}
              <CalendarIcon className="mr-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="center">
            {renderCalendar(date)}
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

CustomCalendar.displayName = "CustomCalendar";
export { CustomCalendar };
