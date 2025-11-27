import * as React from "react";
import {
  useFormContext,
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
  RegisterOptions,
  FieldValues,
  Path,
} from "react-hook-form";
import { Check } from "lucide-react";
import { Checkbox as BaseCheckbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

type CheckboxOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type InputType = 'checkbox' | 'radio';

type CustomCheckboxBaseProps<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  wrapperClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  type?: InputType;
  control?: any;
  required?: boolean | string;
  disabled?: boolean;
  className?: string;
  onCheckedChange?: (checked: boolean | (string | number)[]) => void;
  // Group specific props
  options?: CheckboxOption[];
  direction?: "horizontal" | "vertical";
  // Single checkbox specific props
  checked?: boolean;
};

const CustomCheckbox = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  placeholder,
  rules = {},
  error: externalError,
  wrapperClassName,
  labelClassName,
  errorClassName,
  control: externalControl,
  required,
  disabled = false,
  className,
  type = 'checkbox',
  onCheckedChange,
  // Group specific props
  options,
  direction = "vertical",
  // Single checkbox specific props
  checked: externalChecked,
  ...props
}: CustomCheckboxBaseProps<TFieldValues>) => {
  const formContext = useFormContext<TFieldValues>();
  const control = externalControl || (formContext?.control as any);
  const error =
    externalError || (name && formContext?.formState?.errors?.[name]);
  const errorMessage =
    typeof error === "string" ? error : error?.message?.toString() || undefined;

  // Build validation rules
  const isGroup = Boolean(options && options.length > 0);

  const validationRules = React.useMemo(() => {
    const baseRules = {
      ...(required && isGroup && {
        validate: (value: any) => {
          if (Array.isArray(value) && value.length === 0) {
            return "At least one option must be selected";
          }
          return true;
        }
      }),
      ...(required && !isGroup && {
        required: typeof required === "string" ? required : "This field is required",
      }),
      ...rules,
    };
    
    return baseRules;
  }, [required, rules, isGroup]);

  const renderLabel = () => {
    if (!label) return null;
    
    return (
      <div className={cn("mr-2 flex-shrink-0", labelClassName)}>
        <label className={cn("text-sm font-medium", disabled && "opacity-50")}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      </div>
    );
  };

  const handleSingleChange = (field: any, newChecked: boolean) => {
    field?.onChange?.(newChecked);
    onCheckedChange?.(newChecked);
  };

  const handleGroupChange = (
    field: any,
    value: string | number,
    isChecked: boolean
  ) => {
    const currentValues = field?.value || [];
    let newValues;

    if (isChecked) {
      newValues = [...new Set([...currentValues, value])];
    } else {
      newValues = currentValues.filter((v: any) => v !== value);
    }

    field?.onChange?.(newValues);
    onCheckedChange?.(newValues);
  };

  const renderCheckbox = (field: any) => {
    if (isGroup) {
      return (
        <div
          className={cn(
            "flex w-full",
            direction === "vertical"
              ? "flex-col space-y-2"
              : "flex-row flex-wrap gap-4",
            className
          )}
        >
          {options!.map((option) => {
            const isChecked = Array.isArray(field.value)
              ? field.value.includes(option.value)
              : field.value === option.value;
            const isOptionDisabled = disabled || option.disabled;

            return (
              <div
                key={String(option.value)}
                className={cn(
                  "flex items-center space-x-2",
                  isOptionDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                )}
              >
                <Controller
                  name={name}
                  control={control}
                  rules={rules}
                  render={({ field }) => {
                    return type === 'radio' ? (
                      <input
                        type="radio"
                        id={`${name}-${option.value}`}
                        checked={isChecked}
                        onChange={(e) => {
                          const newValue = option.value;
                          field.onChange(newValue);
                          onCheckedChange?.([newValue]);
                        }}
                        disabled={option.disabled || disabled}
                        className={cn(
                          'h-4 w-4 rounded-full border-gray-300 text-primary focus:ring-primary',
                          {
                            'border-red-500': !!error,
                          }
                        )}
                        {...props}
                      />
                    ) : (
                      <BaseCheckbox
                        id={`${name}-${option.value}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          let newValue: any;
                          if (Array.isArray(field.value)) {
                            if (checked) {
                              newValue = [...field.value, option.value];
                            } else {
                              newValue = field.value.filter(
                                (v: any) => v !== option.value
                              );
                            }
                          } else {
                            newValue = checked ? option.value : '';
                          }
                          field.onChange(newValue);
                          onCheckedChange?.(newValue);
                        }}
                        disabled={option.disabled || disabled}
                        className={cn(
                          'h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary',
                          {
                            'border-red-500': !!error,
                          }
                        )}
                        {...props}
                      />
                    );
                  }}
                />
                <label
                  htmlFor={`${name}-${option.value}`}
                  className={cn(
                    "text-sm font-medium leading-none",
                    isOptionDisabled ? "cursor-not-allowed" : "cursor-pointer"
                  )}
                >
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>
      );
    }

    // Single checkbox
    const checked = field?.value ?? externalChecked ?? false;

    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <BaseCheckbox
          id={name}
          checked={checked}
          onCheckedChange={(newChecked) =>
            handleSingleChange(field, newChecked === true)
          }
          disabled={disabled}
          className={cn(
            "h-4 w-4 rounded border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            errorMessage &&
              "border-destructive data-[state=checked]:bg-destructive",
            className
          )}
          {...props}
        >
          <Check className="h-3 w-3" />
        </BaseCheckbox>
        {label && (
          <label
            htmlFor={name}
            className={cn(
              "text-sm font-medium leading-none",
              disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
      </div>
    );
  };

  const renderError = () => {
    return (
      <div className="relative h-5">
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
      render={({ field }) => renderCheckbox(field)}
    />
  ) : (
    renderCheckbox({ value: externalChecked, onChange: onCheckedChange })
  );

  return (
    <div className={cn("w-full space-y-1.5", wrapperClassName)}>
      <div className="flex items-start">
        {renderLabel()}
        <div className="flex-1">
          <div className="w-full rounded-md ">
            <div className="p-1">
              {content}
            </div>
          </div>
          {renderError()}

        </div>
      </div>
    </div>
  );
};

CustomCheckbox.displayName = "CustomCheckbox";

export { CustomCheckbox };
export type { CheckboxOption };
