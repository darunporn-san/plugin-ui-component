import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  RegisterOptions,
  FieldValues,
  Path,
} from "react-hook-form";
export type CheckboxOption = {
  value: string | number
  label: string
  disabled?: boolean
}

export type InputType = 'checkbox' | 'radio'

export type CustomCheckboxBaseProps<TFieldValues extends FieldValues = FieldValues> = {
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