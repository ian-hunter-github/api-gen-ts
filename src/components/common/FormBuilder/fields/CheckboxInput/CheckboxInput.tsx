import React from 'react';
import { UseFormRegister, FieldError, FieldValues } from 'react-hook-form';
import '../fields.css';

export interface CheckboxInputProps {
  name: string;
  label?: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean | string;
  error?: FieldError;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  validation?: {
    validate?: (value: unknown) => string | true;
  };
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  name,
  label,
  register,
  required = false,
  error,
  disabled,
  readOnly,
  className = '',
  validation
}) => {
  return (
    <div className={`form-field ${className} ${error ? 'error' : ''}`}>
      <label>
        <input
          type="checkbox"
          id={name}
          className="form-checkbox"
          disabled={disabled || readOnly}
          {...register(name, {
            required: typeof required === 'string' ? required : required ? `${label || 'This field'} is required` : false,
            ...validation
          })}
        />
        {label && <span className="checkbox-text">{label}</span>}
      </label>
      {error && <span className="field-error">{error.message}</span>}
    </div>
  );
};

export default CheckboxInput;
