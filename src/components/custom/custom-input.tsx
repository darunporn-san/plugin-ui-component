import * as React from "react";
import {
  useFormContext,
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
  RegisterOptions,
  ControllerRenderProps,
  FieldValues,
  FieldPath,
  Path,
  PathValue,
} from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { buildValidationRules, LengthRule } from "@/utils/validation-rules";
import { CustomCalendar } from "./custom-calendar";
import { useEffect, useRef, useState } from "react";

// Omit the conflicting props from InputHTMLAttributes
// Separate our custom props from native input props
type LabelPosition = 'top' | 'left' | 'right';

type CustomInputBaseProps<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  labelPosition?: LabelPosition;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  wrapperClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  control?: any;
  required?: boolean | string;
  minLength?: LengthRule;
  maxLength?: LengthRule;
  pattern?: { value: RegExp; message: string };
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "textarea"
    | string;
  [key: string]: any; // Allow any other props
};

// Create the full props type by combining with HTML input props, omitting conflicting ones
type CustomInputProps<TFieldValues extends FieldValues = FieldValues> =
  CustomInputBaseProps<TFieldValues> &
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      | keyof CustomInputBaseProps<TFieldValues>
      | "name"
      | "minLength"
      | "maxLength"
      | "required"
      | "pattern"
      | "type"
    > & {
      // Add back the type prop with a more specific type
      type?:
        | "text"
        | "email"
        | "password"
        | "number"
        | "tel"
        | "url"
        | "search"
        | "textarea"
        | string;
    };

// Validation rules are now imported from validation-rules.ts

const CustomInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  CustomInputProps
>(
  (
    {
      name,
      label,
      labelPosition = 'top',
      type = "text",
      rules: rulesProp = {},
      className,
      wrapperClassName,
      labelClassName,
      errorClassName,
      control: controlProp,
      required,
      minLength: minLengthProp,
      maxLength: maxLengthProp,
      pattern,
      ...props
    },
    ref
  ) => {
    // Convert simplified props to react-hook-form rules
    const rules = React.useMemo(
      () =>
        buildValidationRules({
          rulesProp,
          required,
          minLength: minLengthProp,
          maxLength: maxLengthProp,
          pattern,
        }),
      [rulesProp, required, minLengthProp, maxLengthProp, pattern]
    );
    const context = useFormContext();
    const control = controlProp || context?.control;
    const errors = context?.formState?.errors || {};
    const fieldError = errors[name] || props.error;

    const [calendarOpen, setCalendarOpen] = useState(false);
    const [selectedDateLocal, setSelectedDateLocal] = useState<Date | undefined>(undefined);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setCalendarOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const renderLabel = () => (
      <label
        htmlFor={name}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          labelClassName,
          {
            'block mb-1': labelPosition === 'top',
            'inline-flex items-center mr-2 -translate-y-2': labelPosition === 'left',
            'inline-flex items-center ml-2 -translate-y-2': labelPosition === 'right',
          }
        )}
      >
        {label}
        {rules?.required && (
          <span className="text-destructive ml-1">*</span>
        )}
      </label>
    );

    const renderInput = () => (
      <Controller
        name={name as Path<FieldValues>}
        control={control}
        rules={rules}
        render={({ field }) => {
          const { ref: _, value = '', ...fieldProps } = field;

          // Extract props that shouldn't be passed to the underlying input/textarea
          const {
            error: _error,
            control: _control,
            rules: _rules,
            wrapperClassName: _wrapperClassName,
            labelClassName: _labelClassName,
            errorClassName: _errorClassName,
            minLength: _minLength,
            maxLength: _maxLength,
            pattern: _pattern,
            ...cleanProps
          } = props;

          if (type === "textarea") {
            return (
              <Textarea
                {...fieldProps}
                {...cleanProps}
                id={name}
                value={value || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                className={cn(
                  fieldError &&
                    "border-destructive focus-visible:ring-destructive",
                  className
                )}
                ref={ref as React.Ref<HTMLTextAreaElement>}
              />
            );
          }
          // If this input is a date input, show calendar popover when focused/clicked
          if (type === "date" || props.showCalendar) {
            // Parse field value into Date if possible
            const parsed = value ? new Date(value as any) : undefined;
            const validParsed = parsed && !isNaN(parsed.getTime()) ? parsed : undefined;

            // keep local selected date in sync when value changes externally
            useEffect(() => {
              setSelectedDateLocal(validParsed);
            }, [value]);

            const displayValue = selectedDateLocal
              ? selectedDateLocal.toLocaleDateString()
              : typeof value === 'string' && value
              ? value
              : '';

            return (
              <div className="relative" ref={wrapperRef}>
                <Input
                  {...fieldProps}
                  {...cleanProps}
                  readOnly
                  type="text"
                  id={name}
                  value={displayValue}
                  onClick={() => setCalendarOpen(true)}
                  onFocus={() => setCalendarOpen(true)}
                  className={cn(
                    fieldError &&
                      "border-destructive focus-visible:ring-destructive",
                    className
                  )}
                  ref={ref as React.Ref<HTMLInputElement>}
                />
                {calendarOpen && (
                  <div className="absolute z-50 mt-1">
                    <CustomCalendar
                      value={selectedDateLocal}
                      onChange={(d: Date) => {
                        setSelectedDateLocal(d);
                        field.onChange(d);
                        setCalendarOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>
            );
          }

          return (
            <Input
              {...fieldProps}
              {...cleanProps}
              type={type}
              id={name}
              value={value || ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              className={cn(
                fieldError &&
                  "border-destructive focus-visible:ring-destructive",
                className
              )}
              ref={ref as React.Ref<HTMLInputElement>}
            />
          );
        }}
      />
    );

    return (
      <div 
        className={cn(
          "w-full", 
          wrapperClassName,
          {
            'space-y-1': labelPosition === 'top',
            'flex items-center': labelPosition !== 'top',
          }
        )}
      >
        {label && labelPosition !== 'right' && renderLabel()}
        <div className={labelPosition !== 'top' ? 'flex-1' : 'w-full'}>
          {renderInput()}
          <div className="relative h-5 mt-1">
            {fieldError && (
              <p
                className={cn(
                  "text-xs font-medium text-destructive absolute top-0 left-0 w-full",
                  errorClassName
                )}
              >
                {typeof fieldError === 'string'
                  ? fieldError
                  : fieldError?.message?.toString() || 'Invalid field'}
              </p>
            )}
          </div>
        </div>
        {label && labelPosition === 'right' && renderLabel()}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export { CustomInput };

export default CustomInput;
