import { 
  FieldValues, 
  Path, 
  FieldError, 
  FieldErrorsImpl, 
  Merge, 
  RegisterOptions, 
  PathValue 
} from "react-hook-form";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export type LabelPosition = 'top' | 'left' | 'right';

export type CustomInputBaseProps<TFieldValues extends FieldValues = FieldValues> = {
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
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  type?: string;
  [key: string]: any; // Allow any other props
};

export type CustomInputProps<TFieldValues extends FieldValues = FieldValues> =
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
