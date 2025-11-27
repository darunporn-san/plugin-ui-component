import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomButtonProps } from '@/types/button';
import { buttonVariants } from '@/types/button';


const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      leftIcon,
      rightIcon,
      isLoading = false,
      loadingText,
      isExport = false,
      exportData,
      exportFilename = 'export',
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const content = (
      <>
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center bg-inherit">
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText && <span className="ml-2">{loadingText}</span>}
          </span>
        )}
        <span className={cn('flex items-center gap-2', isLoading && 'invisible')}>
          {leftIcon && <span>{leftIcon}</span>}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </span>
      </>
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isExport && exportData) {
        e.preventDefault();
        
        if (exportData instanceof Blob) {
          // Handle Blob data
          const url = window.URL.createObjectURL(exportData);
          downloadFile(url, exportFilename);
        } else if (typeof exportData === 'string') {
          // Handle URL string
          downloadFile(exportData, exportFilename);
        }
      }

      // Call the original onClick handler if provided
      if (onClick) {
        onClick(e);
      }
    };

    const downloadFile = (url: string, filename: string) => {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object if it was created from a Blob
      if (exportData instanceof Blob) {
        window.URL.revokeObjectURL(url);
      }
    };

    // Add download icon if isExport is true and no left/right icon is provided
    const exportIcon = isExport && !leftIcon && !rightIcon ? <Download className="h-4 w-4" /> : null;
    const buttonContent = exportIcon ? (
      <span className={cn('flex items-center gap-2', isLoading && 'invisible')}>
        {exportIcon}
        {children}
      </span>
    ) : content;

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, className, isLoading }),
          'relative transition-all duration-200 ease-in-out',
          variant === 'custom' && 'hover:scale-[1.02] focus:scale-[1.02]',
          isExport && 'cursor-pointer'
        )}
        disabled={isLoading || props.disabled}
        onClick={handleClick}
        {...props}
      >
        {buttonContent}
      </Comp>
    );
  }
);

CustomButton.displayName = 'CustomButton';

export { CustomButton, buttonVariants };