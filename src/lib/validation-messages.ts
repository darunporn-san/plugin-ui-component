import { RegisterOptions } from "react-hook-form"

/**
 * Generates default validation messages for common validation rules
 * @param rule - The validation rule name
 * @param value - The value associated with the rule (e.g., min length, max length, etc.)
 * @returns A user-friendly validation message
 */
export const generateDefaultMessage = (rule: string, value: any): string => {
  switch (rule) {
    case 'required':
      return 'This field is required'
    case 'minLength':
      return `Must be at least ${value} characters`
    case 'maxLength':
      return `Must not exceed ${value} characters`
    case 'min':
      return `Must be at least ${value}`
    case 'max':
      return `Must be at most ${value}`
    case 'pattern':
      return 'Invalid format'
    default:
      return 'Invalid field'
  }
}

/**
 * Extracts the appropriate error message from a field error
 * @param fieldError - The error object from react-hook-form
 * @param rules - The validation rules for the field
 * @returns A user-friendly error message
 */
export const getErrorMessage = (
  fieldError: any,
  rules?: RegisterOptions
): string => {
  if (!fieldError) return ''
  
  if (typeof fieldError === 'string') return fieldError
  
  if (fieldError.message) return fieldError.message
  
  // Try to find the first validation error and generate a message
  const errorType = Object.keys(fieldError).find(key => {
    if (key === 'message') return false;
    const ruleKey = key as keyof RegisterOptions;
    return ruleKey in (rules || {});
  });
  
  if (errorType) {
    const ruleKey = errorType as keyof RegisterOptions;
    const ruleValue = rules?.[ruleKey];
    const value = ruleValue && typeof ruleValue === 'object' && 'value' in ruleValue 
      ? ruleValue.value 
      : ruleValue;
    return generateDefaultMessage(errorType, value);
  }
  
  return 'Invalid field'
}
