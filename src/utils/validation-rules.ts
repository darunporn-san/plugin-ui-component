import { RegisterOptions } from "react-hook-form"

type LengthRule = number | { value: number; message: string }
type PatternRule = { value: RegExp; message: string }

const defaultMessages = {
  required: "This field is required",
  minLength: (value: number) => `Must be at least ${value} characters`,
  maxLength: (value: number) => `Must not exceed ${value} characters`,
  pattern: "Invalid format"
}

const normalizeLengthRule = (rule: LengthRule, getMessage: (value: number) => string) => {
  if (typeof rule === "number") {
    return { value: rule, message: getMessage(rule) }
  }
  return rule
}

export const buildValidationRules = ({
  rulesProp = {},
  required,
  minLength,
  maxLength,
  pattern,
}: {
  rulesProp?: RegisterOptions
  required?: boolean | string
  minLength?: LengthRule
  maxLength?: LengthRule
  pattern?: PatternRule
}) => {
  const rules: RegisterOptions = { ...rulesProp }

  // Handle required validation
  if (required) {
    rules.required = typeof required === 'string' ? required : defaultMessages.required
  }

  // Handle minLength validation
  if (minLength) {
    rules.minLength = normalizeLengthRule(minLength, defaultMessages.minLength)
  }

  // Handle maxLength validation
  if (maxLength) {
    rules.maxLength = normalizeLengthRule(maxLength, defaultMessages.maxLength)
  }

  // Handle pattern validation
  if (pattern) {
    rules.pattern = pattern
  } else if (rules.pattern && typeof rules.pattern === 'object' && 'value' in rules.pattern) {
    // Ensure pattern has a message
    if (!rules.pattern.message) {
      rules.pattern.message = defaultMessages.pattern
    }
  }

  return rules
}

export type { LengthRule }

