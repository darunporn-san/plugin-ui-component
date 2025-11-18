import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";

interface CustomCalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
}


const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Calendar variants (for future extension, e.g. color, size)
// Example: const customCalendarVariants = cva(...)
// For now, just a placeholder for API consistency
export const customCalendarVariants = () => "";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}


const CustomCalendar = React.forwardRef<HTMLDivElement, CustomCalendarProps>(
  ({ value, onChange }, ref) => {
    const today = new Date();
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState<number>(value?.getMonth() ?? today.getMonth());
    const [currentYear, setCurrentYear] = useState<number>(value?.getFullYear() ?? today.getFullYear());
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
    const [inputValue, setInputValue] = useState<string>(value ? value.toLocaleDateString() : "");
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      // sync when value prop changes
      setSelectedDate(value);
      setInputValue(value ? value.toLocaleDateString() : "");
      setCurrentMonth(value?.getMonth() ?? today.getMonth());
      setCurrentYear(value?.getFullYear() ?? today.getFullYear());
    }, [value]);

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setCalendarOpen(false);
        }
      }
      function handleKey(e: KeyboardEvent) {
        if (e.key === "Escape") setCalendarOpen(false);
      }
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKey);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKey);
      };
    }, []);

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const handlePrevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };

    const handleNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };

    const handleDateClick = (day: number) => {
      const date = new Date(currentYear, currentMonth, day);
      setSelectedDate(date);
      setInputValue(date.toLocaleDateString());
      onChange?.(date);
      setCalendarOpen(false);
    };

    const toggleCalendar = () => setCalendarOpen((v) => !v);

    return (
      <div ref={ref} className="relative inline-block" aria-expanded={calendarOpen}>
        <div ref={wrapperRef} className="w-80">
          <Input
            ref={inputRef}
            readOnly
            value={inputValue}
            onClick={toggleCalendar}
            onFocus={() => setCalendarOpen(true)}
            placeholder="Select date"
            className="w-full"
          />

          {calendarOpen && (
            <div className="absolute z-50 mt-2">
              <div className="w-80 p-4 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center mb-2">
                  <button onClick={handlePrevMonth} className="px-2 py-1 rounded hover:bg-gray-100">&lt;</button>
                  <span className="font-semibold">
                    {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })} {currentYear}
                  </span>
                  <button onClick={handleNextMonth} className="px-2 py-1 rounded hover:bg-gray-100">&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="text-center font-medium text-gray-500">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={"empty-" + i} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isSelected =
                      selectedDate &&
                      selectedDate.getDate() === day &&
                      selectedDate.getMonth() === currentMonth &&
                      selectedDate.getFullYear() === currentYear;
                    return (
                      <button
                        key={day}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-blue-100 ${
                          isSelected ? "bg-blue-500 text-white" : ""
                        }`}
                        onClick={() => handleDateClick(day)}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

CustomCalendar.displayName = "CustomCalendar";

export { CustomCalendar };
