'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLiveRegion } from './LiveRegion';

interface AccessibleFormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'textarea' | 'select';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  successMessage?: string;
  options?: Array<{ value: string; label: string }>;
  autoComplete?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  required = false,
  placeholder,
  description,
  errorMessage,
  successMessage,
  options = [],
  autoComplete,
  pattern,
  minLength,
  maxLength,
  className = '',
  disabled = false,
  readOnly = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenBlurred, setHasBeenBlurred] = useState(false);
  const { announceFormValidation } = useLiveRegion();
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  const successId = `${id}-success`;

  // Announce validation messages to screen readers
  useEffect(() => {
    if (hasBeenBlurred && errorMessage) {
      announceFormValidation(label, errorMessage);
    } else if (hasBeenBlurred && successMessage) {
      announceFormValidation(label, successMessage);
    }
  }, [errorMessage, successMessage, hasBeenBlurred, label, announceFormValidation]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasBeenBlurred(true);
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const getAriaDescribedBy = () => {
    const ids = [];
    if (description) ids.push(descriptionId);
    if (errorMessage) ids.push(errorId);
    if (successMessage) ids.push(successId);
    return ids.length > 0 ? ids.join(' ') : undefined;
  };

  const hasError = hasBeenBlurred && errorMessage;
  const hasSuccess = hasBeenBlurred && successMessage && !errorMessage;

  const commonProps = {
    ref: fieldRef,
    id,
    value,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    disabled,
    readOnly,
    required,
    'aria-required': required,
    'aria-invalid': hasError ? 'true' : 'false',
    'aria-describedby': getAriaDescribedBy(),
    autoComplete,
    placeholder,
    className: `
      w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
      focus:outline-none focus:ring-4 focus:ring-blue-500/20
      disabled:opacity-50 disabled:cursor-not-allowed
      ${hasError 
        ? 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-red-500/20' 
        : hasSuccess
        ? 'border-green-500 bg-green-50 focus:border-green-600 focus:ring-green-500/20'
        : 'border-gray-300 bg-white focus:border-blue-500'
      }
      ${isFocused ? 'ring-4' : ''}
      ${className}
    `.trim()
  };

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...(commonProps as any)}
            rows={4}
            minLength={minLength}
            maxLength={maxLength}
          />
        );
      
      case 'select':
        return (
          <select {...(commonProps as any)}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            {...(commonProps as any)}
            type={type}
            pattern={pattern}
            minLength={minLength}
            maxLength={maxLength}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label 
        htmlFor={id}
        className={`
          block text-sm font-medium transition-colors
          ${hasError ? 'text-red-700' : hasSuccess ? 'text-green-700' : 'text-gray-700'}
        `}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="campo obrigatório">
            *
          </span>
        )}
      </label>

      {/* Description */}
      {description && (
        <p id={descriptionId} className="text-sm text-gray-600">
          {description}
        </p>
      )}

      {/* Field */}
      <div className="relative">
        {renderField()}
        
        {/* Visual feedback icons */}
        {hasError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {hasSuccess && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <div 
          id={errorId}
          role="alert"
          aria-live="polite"
          className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200"
        >
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success message */}
      {hasSuccess && (
        <div 
          id={successId}
          role="status"
          aria-live="polite"
          className="flex items-start gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200"
        >
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
};

interface AccessibleFormProps {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  noValidate?: boolean;
}

export const AccessibleForm: React.FC<AccessibleFormProps> = ({
  onSubmit,
  children,
  title,
  description,
  className = '',
  noValidate = true
}) => {
  const { announceFormValidation } = useLiveRegion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for form validation
    const form = e.target as HTMLFormElement;
    const isValid = form.checkValidity();
    
    if (!isValid) {
      announceFormValidation('Formulário', 'Por favor, corrija os erros antes de enviar');
      
      // Focus first invalid field
      const firstInvalidField = form.querySelector(':invalid') as HTMLElement;
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    onSubmit(e);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      noValidate={noValidate}
      className={`space-y-6 ${className}`}
      aria-label={title}
    >
      {title && (
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      )}
      
      <fieldset className="space-y-4">
        <legend className="sr-only">{title || 'Campos do formulário'}</legend>
        {children}
      </fieldset>
    </form>
  );
};

export default AccessibleFormField;