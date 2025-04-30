import React from 'react';
import { UseFormRegister, FieldError, FieldValues } from 'react-hook-form';
import '../fields.css';

export interface TextAreaProps {
  name: string;
  label?: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean | string;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  rows?: number;
  validation?: {
    pattern?: {
      value: RegExp;
      message: string;
    };
    minLength?: number | { value: number, message: string };
    maxLength?: number | { value: number, message: string };
    validate?: (value: unknown) => string | true;
  };
}

const TextArea: React.FC<TextAreaProps> = ({
  name,
  label,
  register,
  required = false,
  error,
  placeholder,
  disabled,
  readOnly,
  className = '',
  rows = 3,
  validation
}) => {
  return (
    <div className={`field-container ${className}`}>
      {label && <label className="field-label" htmlFor={name}>{label}</label>}
      <div className="textarea-container">
        <textarea
          id={name}
          className={`field-input ${error ? 'error' : ''}`}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          {...register(name, {
            required: typeof required === 'string' ? required : required ? `${label || 'This field'} is required` : false,
            ...validation
          })}
        />
      </div>
      {error && <span className="field-error">{error.message}</span>}
    </div>
  );
};

export default TextArea;
