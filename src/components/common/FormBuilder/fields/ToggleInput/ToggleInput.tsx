import React from 'react';
import { UseFormRegister, FieldError, FieldValues } from 'react-hook-form';
import { useApiFormContext } from '../../../../../contexts/ApiFormContext';
import './ToggleInput.css';

export interface ToggleInputProps {
  name: string;
  label?: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean | string;
  error?: FieldError;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

const ToggleInput: React.FC<ToggleInputProps> = ({
  name,
  label,
  register,
  required = false,
  error,
  disabled,
  className = '',
}) => {
  const { readOnly, setHasChanges, setHasErrors } = useApiFormContext();

  React.useEffect(() => {
    if (error) {
      setHasErrors(true);
    }
  }, [error, setHasErrors]);

  const handleChange = () => {
    setHasChanges(true);
  };

  return (
    <div className={`form-field ${className} ${error ? 'error' : ''}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <label className="toggle-switch">
        <input
          id={name}
          type="checkbox"
          className="toggle-input"
          disabled={disabled}
          readOnly={readOnly}
          {...register(name, {
            onChange: handleChange,
            required: typeof required === 'string' ? required : required ? `${label || 'This field'} is required` : false,
          })}
        />
        <span className="toggle-slider"></span>
      </label>
      {error && <span className="field-error">{error.message}</span>}
    </div>
  );
};

export default ToggleInput;
