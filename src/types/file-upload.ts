import { InputHTMLAttributes } from "react"

export type FileWithPreview = File & {
  preview: string
  path: string
}

export interface FileUploadProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'accept'> {
  /**
   * The maximum file size in bytes (default: 5MB)
   */
  maxSize?: number
  /**
   * The maximum number of files to accept (default: 1)
   */
  maxFiles?: number
  /**
   * The accepted file types (e.g., { 'image/*': [] }, { 'application/pdf': ['.pdf'] })
   * @default { 'image/*': [] }
   */
  accept?: Record<string, string[]> | string | undefined
  /**
   * Callback when files are selected
   */
  onFilesSelected?: (files: FileWithPreview[]) => void
  /**
   * Whether to show the file list (default: true)
   */
  showFileList?: boolean
  /**
   * Whether the upload is in progress
   */
  isUploading?: boolean
  /**
   * Custom upload button text
   */
  uploadButtonText?: string
  /**
   * Custom dropzone text
   */
  dropzoneText?: string
  /**
   * Custom dropzone active text
   */
  dropzoneActiveText?: string
}
