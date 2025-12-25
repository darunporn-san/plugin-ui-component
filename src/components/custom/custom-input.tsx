import * as React from "react";
import { Controller, useFormContext, FieldValues, Path } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { buildValidationRules } from "@/utils/validation-rules";
import type { CustomInputProps } from "@/types/input";

const CustomInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  CustomInputProps
>(
  (
    {
      name,
      label,
      labelPosition = "top",
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
      error: propError,
      ...props
    },
    ref
  ) => {
    const context = useFormContext();
    const control = controlProp || context?.control;

    const errors = context?.formState?.errors || {};
    const fieldError = errors[name] || propError;

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

    const renderLabel = () => (
      <label
        htmlFor={name}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          labelClassName,
          {
            "block mb-1": labelPosition === "top",
            "inline-flex items-center mr-2 -translate-y-2": labelPosition === "left",
            "inline-flex items-center ml-2 -translate-y-2": labelPosition === "right",
          }
        )}
      >
        {label}
        {rules?.required && <span className="text-destructive ml-1">*</span>}
      </label>
    );

    const renderInput = () => {
      if (control) {
        // ใช้ react-hook-form
        return (
          <Controller
            name={name as Path<FieldValues>}
            control={control}
            rules={rules}
            render={({ field }) => {
              const { ref: _, value = "", ...fieldProps } = field;
              const inputValue = type === 'number' && value === '' ? '' : value;

              const { error: _error, control: _c, ...cleanProps } = props;

              if (type === "textarea") {
                return (
                  <Textarea
                    {...fieldProps}
                    {...cleanProps}
                    id={name}
                    value={inputValue ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className={cn(
                      fieldError && "border-destructive focus-visible:ring-destructive",
                      className
                    )}
                    ref={ref as React.Ref<HTMLTextAreaElement>}
                  />
                );
              }

              return (
                <Input
                  {...fieldProps}
                  {...cleanProps}
                  type={type}
                  id={name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  className={cn(
                    fieldError && "border-destructive focus-visible:ring-destructive",
                    className
                  )}
                  ref={ref as React.Ref<HTMLInputElement>}
                />
              );
            }}
          />
        );
      } else {
        // Render without react-hook-form
        const commonProps = {
          ...props,
          id: name,
          className: cn(className),
          value: type === 'number' && (props.value === null || props.value === undefined) ? '' : props.value ?? "",
          onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            props.onChange?.(e);
          },
        };

        if (type === "textarea") {
          return <Textarea {...commonProps} ref={ref as React.Ref<HTMLTextAreaElement>} />;
        }
        
        return <Input type={type} {...commonProps} ref={ref as React.Ref<HTMLInputElement>} />;
      }
    };

    return (
      <div
        className={cn("w-full", wrapperClassName, {
          "space-y-1": labelPosition === "top",
          "flex items-center": labelPosition !== "top",
        })}
      >
        {label && labelPosition !== "right" && renderLabel()}
        <div className={labelPosition !== "top" ? "flex-1" : "w-full"}>
          {renderInput()}
          <div className="relative h-5 mt-1">
            {fieldError && (
              <p
                className={cn(
                  "text-xs font-medium text-destructive absolute top-0 left-0 w-full",
                  errorClassName
                )}
              >
                {typeof fieldError === "string"
                  ? fieldError
                  : fieldError?.message?.toString() || "Invalid field"}
              </p>
            )}
          </div>
        </div>
        {label && labelPosition === "right" && renderLabel()}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export { CustomInput };
export default CustomInput;
