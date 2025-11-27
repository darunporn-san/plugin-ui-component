import { FieldValues, Path, FieldError, Control } from "react-hook-form";
import { DateRange } from "react-day-picker";

export interface CustomCalendarProps<T extends FieldValues> {
  className?: string;
  selected?: Date | DateRange;
  onSelect?: (value: Date | DateRange | undefined) => void;
  label?: string;
  mode?: "single" | "range";
  control?: Control<T>;
  name?: Path<T>;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
  fromYear?: number;
  toYear?: number;
  fromMonth?: Date;
  toMonth?: Date;
  fromDate?: Date;
  toDate?: Date;
  numberOfMonths?: number;
}

export interface CalendarBoxProps {
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
  label?: string;
  required?: boolean;
  error?: FieldError;
  displayText: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
  disabled?: boolean;
}
