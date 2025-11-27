import * as React from "react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Upload, File, X, Loader2 } from "lucide-react"
import { CustomButton } from "./custom-button"
import { Button } from "@/components/ui/button"
import type { FileWithPreview, FileUploadProps } from "@/types/file-upload"

export { type FileWithPreview, type FileUploadProps } from "@/types/file-upload"

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({
    className,
    accept = {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf']
    } as const,
    maxSize = 5 * 1024 * 1024, // 5MB
    maxFiles = 5, // Allow up to 5 files by default
    onFilesSelected,
    showFileList = true,
    isUploading = false,
    uploadButtonText = 'Choose files',
    dropzoneText = 'Drag & drop files here, or click to select',
    dropzoneActiveText = 'Drop the files here...',
    ...props
  }, ref) => {
    const [files, setFiles] = useState<FileWithPreview[]>([])
    const [rejected, setRejected] = useState<File[]>([])

    const onDrop = useCallback(
      (acceptedFiles: File[], fileRejections: any[]) => {
        // Handle accepted files
        const mappedFiles = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ) as FileWithPreview[]

        setFiles((prevFiles) => {
          const newFiles = [...prevFiles, ...mappedFiles].slice(0, maxFiles)
          if (onFilesSelected) {
            onFilesSelected(newFiles)
          }
          return newFiles
        })

        // Handle rejected files
        if (fileRejections.length > 0) {
          setRejected((prev) => [
            ...prev,
            ...fileRejections.map(({ file }) => file),
          ])
        }
      },
      [maxFiles, onFilesSelected]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: typeof accept === 'string' ? { [accept]: [] } : accept,
      maxSize,
      maxFiles,
      disabled: isUploading,
    })

    const removeFile = (path: string) => {
      setFiles((prevFiles) => {
        const newFiles = prevFiles.filter((file) => file.path !== path)
        if (onFilesSelected) {
          onFilesSelected(newFiles)
        }
        return newFiles
      })
    }

    // Clean up object URLs to prevent memory leaks
    React.useEffect(() => {
      return () => {
        files.forEach((file) => URL.revokeObjectURL(file.preview))
      }
    }, [files])

    return (
      <div className={cn("space-y-4", className)}>
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/25 hover:border-primary/50",
            isUploading && "opacity-60 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} ref={ref} {...props} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              {isDragActive ? dropzoneActiveText : dropzoneText}
            </div>
            <p className="text-xs text-muted-foreground">
              {`${Object.values(accept)
                .flat()
                .join(", ")} (Max ${maxSize / 1024 / 1024}MB)`}
            </p>
            <div>
              <input
                {...getInputProps()}
                id="file-upload"
                type="file"
                className="hidden"
                multiple={maxFiles > 1}
              />
              <CustomButton
                type="button"
                variant="outline"
                className={cn("relative cursor-pointer", className)}
                disabled={isUploading}
                leftIcon={isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById('file-upload')?.click();
                }}
              >
                {isUploading ? 'Uploading...' : uploadButtonText}
              </CustomButton>
            </div>
          </div>
        </div>

        {showFileList && (files.length > 0 || rejected.length > 0) && (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.path}
                className="flex items-center justify-between p-3 border rounded-md bg-muted/50"
              >
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <CustomButton
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file.path)}
                  className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </CustomButton>
              </div>
            ))}

            {rejected.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border border-destructive/20 rounded-md bg-destructive/5 text-destructive text-sm"
              >
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4" />
                  <span className="truncate max-w-[200px]">{file.name}</span>
                </div>
                <div className="text-xs">File is too large or not supported</div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

FileUpload.displayName = "FileUpload"

export { FileUpload }
