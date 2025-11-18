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
  Path,
  FieldPath,
} from "react-hook-form";
import { ChevronDown, X } from "lucide-react";
import {
  Select as BaseSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { buildValidationRules, LengthRule } from "@/utils/validation-rules";

type LabelPosition = 'top' | 'left' | 'right';

type Option = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type CustomSelectBaseProps<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  labelPosition?: LabelPosition;
  options: Option[];
  placeholder?: string;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  wrapperClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  control?: any;
  required?: boolean | string;
  disabled?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
};

type CustomSelectProps<TFieldValues extends FieldValues> = Omit<
  React.ComponentProps<typeof BaseSelect>,
  'onValueChange' | 'defaultValue' | 'value' | 'name' | 'disabled'
> &
  CustomSelectBaseProps<TFieldValues> & {
    value?: string | number;
    onChange?: (value: string) => void;
  };

const CustomSelect = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  labelPosition = 'top',
  options,
  placeholder = 'Select an option',
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
  ...props
}: CustomSelectProps<TFieldValues>) => {
  const formContext = useFormContext<TFieldValues>();
  const control = externalControl || (formContext?.control as any);
  const error = externalError || (name && formContext?.formState?.errors?.[name]);
  const errorMessage = typeof error === 'string' 
    ? error 
    : error?.message?.toString() || undefined;

  // Build validation rules
  const validationRules = React.useMemo(() => {
    return {
      ...(required && { required: typeof required === 'string' ? required : 'This field is required' }),
      ...rules,
    };
  }, [required, rules]);

  const renderLabel = () => {
    if (!label) return null;
    
    return (
      <label
        htmlFor={name}
        className={cn(
          'text-sm font-medium leading-none',
          disabled && 'opacity-50',
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    );
  };

  const renderSelect = (field: any) => {
    const rawValue = field?.value;
    const normalizedValue =
      rawValue === null || rawValue === undefined || rawValue === ""
        ? ""
        : String(rawValue);
    const hasValue = normalizedValue !== "";

    const handleValueChange = (value: string) => {
      field?.onChange?.(value);
      onValueChange?.(value);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent the select from opening
      field?.onChange?.("");
      onValueChange?.("");
    };

    return (
      <div className="relative">
        <BaseSelect
          {...field}
          value={normalizedValue}
          onValueChange={handleValueChange}
          disabled={disabled}
        >
          <SelectTrigger
            className={cn(
              "w-full pr-9 [&>svg:last-child]:hidden",
              errorMessage && "border-destructive focus-visible:ring-destructive",
              className
            )}
          >
            <SelectValue placeholder={!hasValue ? placeholder : undefined} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                  disabled={option.disabled}
                >
                  {option.label}
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
            onMouseDown={(event) => event.preventDefault()}
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

  const renderError = () => {
    return (
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
  };

  const content = control ? (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field }) => renderSelect(field)}
    />
  ) : (
    renderSelect({
      value: props.value,
      onChange: props.onChange,
    })
  );

  const containerClasses = cn(
    'w-full',
    labelPosition === 'left' ? 'flex items-center space-x-4' : 'space-y-2',
    wrapperClassName
  );

  const labelContainerClasses = cn(
    'block',
    labelPosition === 'left' ? 'w-1/4' : 'w-full'
  );

  const inputContainerClasses = cn(
    labelPosition === 'left' ? 'w-3/4' : 'w-full',
    'relative'
  );

  return (
    <div className={containerClasses}>
      {labelPosition === 'left' ? (
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
