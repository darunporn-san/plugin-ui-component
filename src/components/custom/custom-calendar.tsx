import React, { useState } from "react";

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
    const [currentMonth, setCurrentMonth] = useState(value?.getMonth() ?? today.getMonth());
    const [currentYear, setCurrentYear] = useState(value?.getFullYear() ?? today.getFullYear());
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

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
      onChange?.(date);
    };

    return (
      <div ref={ref} className="w-80 p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-2">
          <button onClick={handlePrevMonth} className="px-2 py-1 rounded hover:bg-gray-100">&lt;</button>
          <span className="font-semibold">
            {today.toLocaleString("default", { month: "long" })} {currentYear}
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
    );
  }
);

CustomCalendar.displayName = "CustomCalendar";

export { CustomCalendar };
