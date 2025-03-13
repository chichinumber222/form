import { reactive, computed } from 'vue'

export interface ValidationRule {
  rule: string
  message: string
  value?: any
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule[]
}

export function useFormValidation(formValues: Record<string, any>, rules: ValidationRules) {
  const errors = reactive<Record<string, string[]>>({})

  Object.keys(rules).forEach((field) => {
    errors[field] = []
  })

  const checkRule = (value: any, ruleObj: ValidationRule): boolean => {
    switch (ruleObj.rule) {
      case 'required':
        return !!value || value === 0
      case 'minLength':
        return typeof value === 'string'
          ? value.length >= (ruleObj.value ?? 0)
          : false
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      default:
        return true
    }
  }

  const validateField = (fieldName: string) => {
    errors[fieldName] = []

    const value = formValues[fieldName]
    const fieldRules = rules[fieldName] || []

    fieldRules.forEach((ruleObj) => {
      const isValid = checkRule(value, ruleObj)
      if (!isValid) {
        errors[fieldName].push(ruleObj.message)
      }
    })
  }

  const validateAll = () => {
    Object.keys(rules).forEach((field) => {
      validateField(field)
    })
  }

  const isFormValid = computed(() => {
    return Object.values(errors).every((fieldErrors) => fieldErrors.length === 0)
  })

  return {
    errors,
    isFormValid,
    validateField,
    validateAll,
  }
}