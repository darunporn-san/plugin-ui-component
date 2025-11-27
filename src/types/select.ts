import { 
  FieldValues, 
  Path, 
  FieldError, 
  FieldErrorsImpl, 
  Merge, 
  RegisterOptions 
} from "react-hook-form";

export type LabelPosition = "top" | "left" | "right";

export type Option = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

export type CustomSelectBaseProps<TFieldValues extends FieldValues = FieldValues> = {
  name?: Path<TFieldValues>;
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
  [key: string]: any; // Allow any other props
};

export type CustomSelectProps<TFieldValues extends FieldValues = FieldValues> = 
  CustomSelectBaseProps<TFieldValues> & {
    value?: string | number;
    onChange?: (value: string) => void;
    defaultValue?: string | number;
  };
