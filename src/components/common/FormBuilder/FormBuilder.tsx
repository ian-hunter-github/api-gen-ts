import { useForm, FieldValues, Path, DefaultValues } from 'react-hook-form';
import './FormBuilder.css';

export type InputType = 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'date' | 'time' | 'datetime' | 'checkbox' | 'entity-array' | 'deployment-object' | 'security-object';

export interface FieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: InputType;
  defaultValue?: unknown;
  required?: boolean;
  validation?: {
    pattern?: {
      value: RegExp;
      message: string;
    };
    min?: number | { value: number, message: string };
    max?: number | { value: number, message: string };
    validate?: (value: unknown) => string | true;
  };
  options?: {value: string, label: string}[];
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  className?: string;
  rows?: number;
}

export interface FormBuilderProps<T extends FieldValues> {
  fields: FieldConfig<T>[];
  initialValues: T;
  onSubmit: (data: T) => void;
  className?: string;
}

export const FormBuilder = <T extends FieldValues,>({
  fields,
  initialValues,
  onSubmit,
  className = ''
}: FormBuilderProps<T>) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm<T>({
    defaultValues: initialValues as DefaultValues<T>
  });

  const handleFormSubmit = (data: T) => {
    onSubmit(data);
    reset(data);
  };

  const getInputClass = (fieldName: Path<T>) => {
    let className = 'form-input';
    if (errors[fieldName]) className += ' error';
    else if (isDirty && document.activeElement?.getAttribute('name') === fieldName) {
      className += ' changed';
    }
    return className;
  };

  const renderInput = (field: FieldConfig<T>) => {
    const commonProps = {
      ...register(field.name, {
        required: field.required ? `${field.label} is required` : false,
        pattern: field.validation?.pattern,
        min: field.validation?.min,
        max: field.validation?.max,
        validate: field.validation?.validate
      }),
      className: `${getInputClass(field.name)} ${field.className || ''}`,
      placeholder: field.placeholder,
      disabled: field.disabled,
      readOnly: field.readOnly,
      id: `${field.name}-input`
    };

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} rows={field.rows || 3} />;
      case 'select':
        return (
          <select {...commonProps}>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'boolean':
        return (
          <label className="toggle-label">
            <div className="slider-container">
              <input
                type="checkbox"
                {...commonProps}
              />
              <span className="slider-track">
                <span className="slider-thumb"></span>
              </span>
            </div>
            <span className="toggle-text">{field.label}</span>
          </label>
        );
      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  return (
    <div className={`form-builder ${className}`}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {fields.map(field => (
          !field.hidden && (
            <div key={field.name as string} className={`form-group ${field.className || ''}`}>
              {field.type !== 'boolean' && (
                <label htmlFor={`${field.name}-input`}>
                  {field.label}
                </label>
              )}
              {renderInput(field)}
              {errors[field.name] && (
                <span className="error-message">
                  {errors[field.name]?.message as string}
                </span>
              )}
            </div>
          )
        ))}
      </form>
    </div>
  );
}
