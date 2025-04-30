import React from 'react';
import { UseFormRegister, FieldError, FieldValues } from 'react-hook-form';
import '../fields.css';

export interface TextInputProps {
  name: string;
  label?: string;
  type?: 'text' | 'number' | 'date' | 'time' | 'datetime';
  register: UseFormRegister<FieldValues>;
  required?: boolean | string;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  validation?: {
    pattern?: {
      value: RegExp;
      message: string;
    };
    min?: number | { value: number, message: string };
    max?: number | { value: number, message: string };
    validate?: (value: unknown) => string | true;
  };
}

const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  type = 'text',
  register,
  required = false,
  error,
  placeholder,
  disabled,
  readOnly,
  className = '',
  validation
}) => {
  return (
    <div className={`form-field ${className} ${error ? 'error' : ''}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        type={type}
        className="form-input"
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        {...register(name, {
          required: typeof required === 'string' ? required : required ? `${label || 'This field'} is required` : false,
          ...validation
        })}
      />
      {error && <span className="field-error">{error.message}</span>}
    </div>
  );
};

export default TextInput;
