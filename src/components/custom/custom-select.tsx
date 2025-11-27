import * as React from "react";
import {
  useFormContext,
  Controller,
  FieldValues,
} from "react-hook-form";
import { ChevronDown, X } from "lucide-react";
import {
  Select as BaseSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "../ui/select";
import { cn } from "@/lib/utils";
import type { 
  CustomSelectProps, 
  Option 
} from "@/types/select";

/* -------------------------------------------------------
   COMPONENT
------------------------------------------------------- */

const CustomSelect = <
  TFieldValues extends FieldValues = FieldValues
>({
  name,
  label,
  labelPosition = "top",
  options,
  placeholder = "Select an option",
  rules = {},
  error: externalError,
  wrapperClassName,
  labelClassName,
  errorClassName,
  control: externalControl,
  required,
  disabled = false,
  className,
  onValueChange,
  value: externalValue,
  onChange: externalOnChange,
}: CustomSelectProps<TFieldValues>) => {
  const formContext = useFormContext<TFieldValues>();
  const control = externalControl || formContext?.control;

  // error handling
  const hookError =
    formContext?.formState?.errors?.[name as keyof TFieldValues];

  const error = externalError || hookError;
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message?.toString() || undefined;

  // validation
  const validationRules = React.useMemo(() => {
    return {
      ...(required && {
        required:
          typeof required === "string"
            ? required
            : "This field is required",
      }),
      ...rules,
    };
  }, [required, rules]);

  /* -------------------- RENDER LABEL -------------------- */

  const renderLabel = () => {
    if (!label) return null;

    return (
      <label
        htmlFor={name}
        className={cn(
          "text-sm font-medium leading-none",
          disabled && "opacity-50",
          labelClassName
        )}
      >
        {label}
        {required && (
          <span className="text-destructive ml-1">*</span>
        )}
      </label>
    );
  };

  /* ------------------ MAIN SELECT RENDER ------------------ */

  const renderSelect = (field: any) => {
    const rawValue = field?.value;
    const normalizedValue =
      rawValue === undefined || rawValue === null || rawValue === ""
        ? ""
        : String(rawValue);

    const hasValue = normalizedValue !== "";

    const handleValueChange = (value: string) => {
      field?.onChange?.(value);
      onValueChange?.(value);
    };

    const handleClear = (event: React.MouseEvent) => {
      event.stopPropagation();
      field?.onChange?.("");
      onValueChange?.("");
    };

    return (
      <div className="relative">
        <BaseSelect
          value={normalizedValue}
          onValueChange={handleValueChange}
          disabled={disabled}
        >
          <SelectTrigger
            className={cn(
              "w-full pr-9 [&>svg:last-child]:hidden",
              errorMessage &&
                "border-destructive focus-visible:ring-destructive",
              className
            )}
          >
            <SelectValue
              placeholder={!hasValue ? placeholder : undefined}
            />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {options.map((o) => (
                <SelectItem
                  key={String(o.value)}
                  value={String(o.value)}
                  disabled={o.disabled}
                >
                  {o.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </BaseSelect>

        {hasValue && !disabled ? (
          <button
            type="button"
            aria-label="Clear selection"
            className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground focus:outline-none"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground">
            <ChevronDown className="h-4 w-4 opacity-50" />
          </span>
        )}
      </div>
    );
  };

  /* --------------------- RENDER ERROR --------------------- */

  const renderError = () => (
    <div className="relative h-5 mt-1">
      {errorMessage && (
        <p
          className={cn(
            "text-xs font-medium text-destructive absolute top-0 left-0 w-full",
            errorClassName
          )}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );

  /* --------------------- FORM CONTROL --------------------- */

  const content = (name && control) ? (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field }) => renderSelect(field)}
    />
  ) : (
    renderSelect({
      value: externalValue,
      onChange: externalOnChange,
    })
  );

  /* --------------------- LAYOUT ---------------------------- */

  const containerClasses = cn(
    "w-full",
    labelPosition === "left"
      ? "flex items-center space-x-4"
      : "space-y-2",
    wrapperClassName
  );

  const labelContainerClasses = cn(
    "block",
    labelPosition === "left" ? "w-1/4" : "w-full"
  );

  const inputContainerClasses = cn(
    labelPosition === "left" ? "w-3/4" : "w-full",
    "relative"
  );

  return (
    <div className={containerClasses}>
      {labelPosition === "left" ? (
        <>
          <div className={labelContainerClasses}>
            {renderLabel()}
          </div>
          <div className={inputContainerClasses}>
            {content}
            {renderError()}
          </div>
        </>
      ) : (
        <>
          {renderLabel()}
          <div className={inputContainerClasses}>
            {content}
            {renderError()}
          </div>
        </>
      )}
    </div>
  );
};

CustomSelect.displayName = "CustomSelect";

export { CustomSelect };
export type { Option as SelectOption };
