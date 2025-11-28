import * as React$1 from 'react';
import { InputHTMLAttributes } from 'react';
import * as class_variance_authority_dist_types from 'class-variance-authority/dist/types';
import { VariantProps } from 'class-variance-authority';
import { FieldValues, Path, RegisterOptions, FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { DateRange } from 'react-day-picker';
import * as sweetalert2 from 'sweetalert2';

declare const buttonVariants: (props?: ({
    variant?: "default" | "custom" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
    isLoading?: boolean | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string;
interface CustomButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isLoading?: boolean;
    loadingText?: string;
    isExport?: boolean;
    exportData?: Blob | string;
    exportFilename?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

declare const CustomButton: React$1.ForwardRefExoticComponent<CustomButtonProps & React$1.RefAttributes<HTMLButtonElement>>;

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
    minLength?: {
        value: number;
        message: string;
    };
    maxLength?: {
        value: number;
        message: string;
    };
    pattern?: {
        value: RegExp;
        message: string;
    };
    type?: string;
    [key: string]: any;
};
type CustomInputProps<TFieldValues extends FieldValues = FieldValues> = CustomInputBaseProps<TFieldValues> & Omit<InputHTMLAttributes<HTMLInputElement>, keyof CustomInputBaseProps<TFieldValues> | "name" | "minLength" | "maxLength" | "required" | "pattern" | "type"> & {
    type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "textarea" | string;
};

declare const CustomInput: React$1.ForwardRefExoticComponent<Omit<CustomInputProps, "ref"> & React$1.RefAttributes<HTMLInputElement | HTMLTextAreaElement>>;

type LabelPosition = "top" | "left" | "right";
type Option = {
    value: string | number;
    label: string;
    disabled?: boolean;
};
type CustomSelectBaseProps<TFieldValues extends FieldValues = FieldValues> = {
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
    isClearable?: boolean;
    [key: string]: any;
};
type CustomSelectProps<TFieldValues extends FieldValues = FieldValues> = CustomSelectBaseProps<TFieldValues> & {
    value?: string | number;
    onChange?: (value: string) => void;
    defaultValue?: string | number;
};

declare const CustomSelect: {
    <TFieldValues extends FieldValues = FieldValues>({ name, label, labelPosition, options, placeholder, rules, error: externalError, wrapperClassName, labelClassName, errorClassName, control: externalControl, required, disabled, className, onValueChange, value: externalValue, onChange: externalOnChange, isClearable, }: CustomSelectProps<TFieldValues>): react_jsx_runtime.JSX.Element;
    displayName: string;
};

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
    options?: CheckboxOption[];
    direction?: "horizontal" | "vertical";
    checked?: boolean;
};

declare const CustomCheckbox: {
    <TFieldValues extends FieldValues = FieldValues>({ name, label, placeholder, rules, error: externalError, wrapperClassName, labelClassName, errorClassName, control: externalControl, required, disabled, className, type, onCheckedChange, options, direction, checked: externalChecked, ...props }: CustomCheckboxBaseProps<TFieldValues>): react_jsx_runtime.JSX.Element;
    displayName: string;
};

interface CustomCalendarProps<T extends FieldValues> {
    className?: string;
    selected?: Date | DateRange;
    onSelect?: (value: Date | DateRange | undefined) => void;
    label?: string;
    mode?: "single" | "range";
    control?: any;
    name?: Path<T>;
    error?: FieldError;
    required?: boolean;
    disabled?: boolean;
    fromYear?: number;
    toYear?: number;
    fromMonth?: Date;
    toMonth?: Date;
    fromDate?: Date;
    toDate?: Date;
    numberOfMonths?: number;
}

declare const CustomCalendar: React$1.ForwardRefExoticComponent<CustomCalendarProps<any> & React$1.RefAttributes<HTMLDivElement>>;

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
declare const CustomDropdownMenu: React$1.ForwardRefExoticComponent<DropdownMenuProps & React$1.RefAttributes<HTMLButtonElement>>;

type FileWithPreview = File & {
    preview: string;
    path: string;
};
interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'accept'> {
    /**
     * The maximum file size in bytes (default: 5MB)
     */
    maxSize?: number;
    /**
     * The maximum number of files to accept (default: 1)
     */
    maxFiles?: number;
    /**
     * The accepted file types (e.g., { 'image/*': [] }, { 'application/pdf': ['.pdf'] })
     * @default { 'image/*': [] }
     */
    accept?: Record<string, string[]> | string | undefined;
    /**
     * Callback when files are selected
     */
    onFilesSelected?: (files: FileWithPreview[]) => void;
    /**
     * Whether to show the file list (default: true)
     */
    showFileList?: boolean;
    /**
     * Whether the upload is in progress
     */
    isUploading?: boolean;
    /**
     * Custom upload button text
     */
    uploadButtonText?: string;
    /**
     * Custom dropzone text
     */
    dropzoneText?: string;
    /**
     * Custom dropzone active text
     */
    dropzoneActiveText?: string;
}

declare const FileUpload: React$1.ForwardRefExoticComponent<FileUploadProps & React$1.RefAttributes<HTMLInputElement>>;

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React$1.ReactNode);
    className?: string;
}
type Position = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    pageSize?: number;
    className?: string;
    headerClassName?: string;
    rowClassName?: string;
    cellClassName?: string;
    onRowClick?: (row: T) => void;
    isPagination?: boolean;
    countPosition?: Position;
    paginationPosition?: Position;
    pageSizePosition?: Position;
    rowKey?: keyof T | ((row: T) => React$1.Key);
}
declare function DataTable<T>({ columns, data, pageSize, className, headerClassName, rowClassName, cellClassName, onRowClick, isPagination, countPosition, paginationPosition, pageSizePosition, rowKey, }: DataTableProps<T>): react_jsx_runtime.JSX.Element;

declare const alert: {
    success: (t: string) => Promise<sweetalert2.SweetAlertResult<any>>;
    error: (t: string) => Promise<sweetalert2.SweetAlertResult<any>>;
    info: (t: string) => Promise<sweetalert2.SweetAlertResult<any>>;
    confirm: (o: any) => Promise<sweetalert2.SweetAlertResult<any>>;
};

export { type CheckboxOption, type Column, CustomButton, type CustomButtonProps, CustomCalendar, CustomCheckbox, CustomDropdownMenu, CustomInput, CustomSelect, DataTable, type DataTableProps, FileUpload, type FileUploadProps, type FileWithPreview, type Option as SelectOption, alert, buttonVariants };
