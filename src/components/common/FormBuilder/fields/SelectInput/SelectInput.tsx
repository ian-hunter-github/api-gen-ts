import React from 'react';
import { UseFormRegister, FieldError, FieldValues } from 'react-hook-form';
import '../fields.css';

export interface SelectInputProps {
  name: string;
  label?: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean | string;
  error?: FieldError;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  options: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
  placeholder?: string;
  validation?: {
    validate?: (value: unknown) => string | true;
  };
}

const SelectInput: React.FC<SelectInputProps> = ({
  name,
  label,
  register,
  required = false,
  error,
  disabled,
  readOnly,
  className = '',
  options,
  placeholder,
  validation
}) => {
  return (
    <div className={`form-field ${className} ${error ? 'error' : ''}`}>
      {label && <label className="field-label" htmlFor={name}>{label}</label>}
      <select
        id={name}
        className={`field-input`}
        disabled={disabled || readOnly}
        {...register(name, {
          required: typeof required === 'string' ? required : required ? `${label || 'This field'} is required` : false,
          ...validation
        })}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="field-error">{error.message}</span>}
    </div>
  );
};

export default SelectInput;
