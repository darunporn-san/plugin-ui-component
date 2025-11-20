import * as class_variance_authority_dist_types from 'class-variance-authority/dist/types';
import * as React from 'react';
import { InputHTMLAttributes } from 'react';
import { VariantProps } from 'class-variance-authority';
import { FieldValues, Path, RegisterOptions, FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as SelectPrimitive from '@radix-ui/react-select';

declare const buttonVariants: (props?: ({
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string;
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

declare const customButtonVariants: (props?: ({
    variant?: "outline" | "secondary" | "ghost" | "link" | "primary" | "success" | "warning" | "danger" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | "xl" | null | undefined;
    rounded?: "sm" | "lg" | "none" | "xl" | "md" | "full" | null | undefined;
    shadow?: "default" | "sm" | "lg" | "none" | "xl" | "md" | "inner" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string;
interface CustomButtonProps extends Omit<ButtonProps, 'variant' | 'size'>, VariantProps<typeof customButtonVariants> {
    asChild?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isLoading?: boolean;
    fullWidth?: boolean;
    confirmTitle?: React.ReactNode;
    confirmMessage?: React.ReactNode;
    confirmActionText?: React.ReactNode;
    confirmCancelText?: React.ReactNode;
    onConfirm?: (event: React.MouseEvent<HTMLElement>) => void;
    onCancel?: (event: React.MouseEvent<HTMLElement>) => void;
    errors?: any;
    fetchErrors?: () => Promise<any>;
}
declare const CustomButton: React.ForwardRefExoticComponent<CustomButtonProps & React.RefAttributes<HTMLButtonElement>>;

type LengthRule = number | {
    value: number;
    message: string;
};

type LabelPosition$1 = 'top' | 'left' | 'right';
type CustomInputBaseProps<TFieldValues extends FieldValues = FieldValues> = {
    name: Path<TFieldValues>;
    label?: string;
    labelPosition?: LabelPosition$1;
    rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
    error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
    wrapperClassName?: string;
    labelClassName?: string;
    errorClassName?: string;
    control?: any;
    required?: boolean | string;
    minLength?: LengthRule;
    maxLength?: LengthRule;
    pattern?: {
        value: RegExp;
        message: string;
    };
    type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "textarea" | string;
    [key: string]: any;
};
type CustomInputProps<TFieldValues extends FieldValues = FieldValues> = CustomInputBaseProps<TFieldValues> & Omit<InputHTMLAttributes<HTMLInputElement>, keyof CustomInputBaseProps<TFieldValues> | "name" | "minLength" | "maxLength" | "required" | "pattern" | "type"> & {
    type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "textarea" | string;
};
declare const CustomInput: React.ForwardRefExoticComponent<Omit<CustomInputProps<FieldValues>, "ref"> & React.RefAttributes<HTMLInputElement | HTMLTextAreaElement>>;

declare const Select: React.FC<SelectPrimitive.SelectProps>;

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
type CustomSelectProps<TFieldValues extends FieldValues> = Omit<React.ComponentProps<typeof Select>, 'onValueChange' | 'defaultValue' | 'value' | 'name' | 'disabled'> & CustomSelectBaseProps<TFieldValues> & {
    value?: string | number;
    onChange?: (value: string) => void;
};
declare const CustomSelect: {
    <TFieldValues extends FieldValues = FieldValues>({ name, label, labelPosition, options, placeholder, rules, error: externalError, wrapperClassName, labelClassName, errorClassName, control: externalControl, required, disabled, className, onValueChange, ...props }: CustomSelectProps<TFieldValues>): react_jsx_runtime.JSX.Element;
    displayName: string;
};

type CheckboxOption = {
    value: string | number;
    label: string;
    disabled?: boolean;
};
type CustomCheckboxBaseProps<TFieldValues extends FieldValues = FieldValues> = {
    name: Path<TFieldValues>;
    label?: string;
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
    onCheckedChange?: (checked: boolean | (string | number)[]) => void;
    options?: CheckboxOption[];
    direction?: "horizontal" | "vertical";
    checked?: boolean;
};
declare const CustomCheckbox: {
    <TFieldValues extends FieldValues = FieldValues>({ name, label, placeholder, rules, error: externalError, wrapperClassName, labelClassName, errorClassName, control: externalControl, required, disabled, className, onCheckedChange, options, direction, checked: externalChecked, ...props }: CustomCheckboxBaseProps<TFieldValues>): react_jsx_runtime.JSX.Element;
    displayName: string;
};

interface CustomCalendarProps {
    /** Additional class name */
    className?: string;
    /** The selected date */
    selected?: Date | null;
    /** Callback when date is selected */
    onSelect?: (date: Date | undefined) => void;
    /** Label for the date picker */
    label?: string;
    /** Description text */
    description?: string;
}
/**
 * A simple and customizable calendar component
 */
declare const CustomCalendar: React.ForwardRefExoticComponent<CustomCalendarProps & React.RefAttributes<HTMLDivElement>>;

type MenuItem = {
    /** Text to display for the menu item */
    label: string;
    /** Callback when the menu item is clicked */
    onClick?: () => void;
    /** Whether the menu item is disabled */
    disabled?: boolean;
    /** Optional icon to display before the label */
    icon?: React.ReactNode;
    /** Whether to show a separator after this item */
    withSeparator?: boolean;
};
type DropdownMenuProps = {
    /** Text to display on the dropdown button */
    buttonText: string;
    /** Array of menu items to display in the dropdown */
    items: MenuItem[];
    /** Additional class name for the dropdown button */
    className?: string;
    /** Additional class name for the dropdown content */
    contentClassName?: string;
    /** Variant of the button */
    variant?: "default" | "outline" | "ghost" | "link" | "secondary";
    /** Size of the button */
    size?: "default" | "sm" | "lg" | "icon";
    /** Whether the dropdown should be open by default */
    defaultOpen?: boolean;
    /** Whether the dropdown is open (controlled) */
    open?: boolean;
    /** Callback when the open state changes */
    onOpenChange?: (open: boolean) => void;
};
/**
 * A simple dropdown menu component that takes a button text and an array of menu items
 */
declare const CustomDropdownMenu: React.ForwardRefExoticComponent<DropdownMenuProps & React.RefAttributes<HTMLButtonElement>>;

export { type CheckboxOption, CustomButton, type CustomButtonProps, CustomCalendar, CustomCheckbox, CustomDropdownMenu, CustomInput, CustomSelect, type Option as SelectOption, customButtonVariants };
