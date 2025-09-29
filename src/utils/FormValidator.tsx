'use client';

import { useState, useEffect } from 'react';

interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: string | number;
  message: string;
  validator?: (value: string) => boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class FormValidator {
  private rules: Map<string, ValidationRule[]> = new Map();
  
  addRule(fieldId: string, rule: ValidationRule) {
    const existingRules = this.rules.get(fieldId) || [];
    this.rules.set(fieldId, [...existingRules, rule]);
  }

  addRules(fieldId: string, rules: ValidationRule[]) {
    const existingRules = this.rules.get(fieldId) || [];
    this.rules.set(fieldId, [...existingRules, ...rules]);
  }

  validate(fieldId: string, value: string): ValidationResult {
    const rules = this.rules.get(fieldId) || [];
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const rule of rules) {
      switch (rule.type) {
        case 'required':
          if (!value.trim()) {
            errors.push(rule.message);
          }
          break;

        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (value && !emailRegex.test(value)) {
            errors.push(rule.message);
          }
          break;

        case 'minLength':
          if (value && value.length < (rule.value as number)) {
            errors.push(rule.message);
          }
          break;

        case 'maxLength':
          if (value && value.length > (rule.value as number)) {
            errors.push(rule.message);
          }
          break;

        case 'pattern':
          if (value && rule.value) {
            const regex = new RegExp(rule.value as string);
            if (!regex.test(value)) {
              errors.push(rule.message);
            }
          }
          break;

        case 'custom':
          if (value && rule.validator && !rule.validator(value)) {
            errors.push(rule.message);
          }
          break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateAll(formData: Record<string, string>): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {};
    
    for (const [fieldId] of this.rules) {
      results[fieldId] = this.validate(fieldId, formData[fieldId] || '');
    }

    return results;
  }

  isFormValid(formData: Record<string, string>): boolean {
    const results = this.validateAll(formData);
    return Object.values(results).every(result => result.isValid);
  }
}

// Common validation rules
export const ValidationRules = {
  required: (message = 'Este campo é obrigatório'): ValidationRule => ({
    type: 'required',
    message
  }),

  email: (message = 'Digite um e-mail válido'): ValidationRule => ({
    type: 'email',
    message
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    type: 'minLength',
    value: length,
    message: message || `Deve ter pelo menos ${length} caracteres`
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    type: 'maxLength',
    value: length,
    message: message || `Deve ter no máximo ${length} caracteres`
  }),

  phone: (message = 'Digite um telefone válido'): ValidationRule => ({
    type: 'pattern',
    value: '^\\(?\\d{2}\\)?[\\s\\-]?\\d{4,5}[\\s\\-]?\\d{4}$',
    message
  }),

  cpf: (message = 'Digite um CPF válido'): ValidationRule => ({
    type: 'custom',
    message,
    validator: (value: string) => {
      const cpf = value.replace(/\D/g, '');
      if (cpf.length !== 11) return false;
      
      // Check for invalid sequences
      if (/^(\d)\1{10}$/.test(cpf)) return false;
      
      // Validate check digits
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * (10 - i);
      }
      let checkDigit = 11 - (sum % 11);
      if (checkDigit >= 10) checkDigit = 0;
      if (parseInt(cpf[9]) !== checkDigit) return false;
      
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * (11 - i);
      }
      checkDigit = 11 - (sum % 11);
      if (checkDigit >= 10) checkDigit = 0;
      
      return parseInt(cpf[10]) === checkDigit;
    }
  }),

  cep: (message = 'Digite um CEP válido'): ValidationRule => ({
    type: 'pattern',
    value: '^\\d{5}-?\\d{3}$',
    message
  }),

  password: (message = 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número'): ValidationRule => ({
    type: 'custom',
    message,
    validator: (value: string) => {
      return value.length >= 8 &&
             /[A-Z]/.test(value) &&
             /[a-z]/.test(value) &&
             /\d/.test(value);
    }
  }),

  url: (message = 'Digite uma URL válida'): ValidationRule => ({
    type: 'custom',
    message,
    validator: (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }
  })
};

// Hook for form validation
export const useFormValidation = () => {
  const [validator] = useState(() => new FormValidator());
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});
  const [formData, setFormData] = useState<Record<string, string>>({});

  const addValidationRule = (fieldId: string, rule: ValidationRule) => {
    validator.addRule(fieldId, rule);
  };

  const addValidationRules = (fieldId: string, rules: ValidationRule[]) => {
    validator.addRules(fieldId, rules);
  };

  const validateField = (fieldId: string, value: string) => {
    const result = validator.validate(fieldId, value);
    setValidationResults(prev => ({
      ...prev,
      [fieldId]: result
    }));
    return result;
  };

  const validateForm = () => {
    const results = validator.validateAll(formData);
    setValidationResults(results);
    return validator.isFormValid(formData);
  };

  const updateFieldValue = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Validate on change (debounced)
    setTimeout(() => {
      validateField(fieldId, value);
    }, 300);
  };

  const getFieldError = (fieldId: string): string | undefined => {
    const result = validationResults[fieldId];
    return result?.errors[0];
  };

  const getFieldSuccess = (fieldId: string): string | undefined => {
    const result = validationResults[fieldId];
    const value = formData[fieldId];
    
    if (value && result?.isValid && result.errors.length === 0) {
      return 'Campo válido';
    }
    
    return undefined;
  };

  const isFieldValid = (fieldId: string): boolean => {
    const result = validationResults[fieldId];
    return result ? result.isValid : true;
  };

  const hasFieldError = (fieldId: string): boolean => {
    const result = validationResults[fieldId];
    return result ? result.errors.length > 0 : false;
  };

  const reset = () => {
    setFormData({});
    setValidationResults({});
  };

  return {
    formData,
    validationResults,
    addValidationRule,
    addValidationRules,
    validateField,
    validateForm,
    updateFieldValue,
    getFieldError,
    getFieldSuccess,
    isFieldValid,
    hasFieldError,
    reset
  };
};

// Enhanced HTML5 validation attributes generator
export const getValidationAttributes = (rules: ValidationRule[]) => {
  const attributes: Record<string, any> = {};

  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        attributes.required = true;
        break;
      case 'email':
        attributes.type = 'email';
        break;
      case 'minLength':
        attributes.minLength = rule.value;
        break;
      case 'maxLength':
        attributes.maxLength = rule.value;
        break;
      case 'pattern':
        attributes.pattern = rule.value;
        break;
    }
  }

  return attributes;
};

export default FormValidator;