import { useFormContext, FieldError } from 'react-hook-form';
import { FieldMetadata } from '../../../../../types/metadata/types';
import TextInput from '../TextInput/TextInput';
import SelectInput from '../SelectInput/SelectInput';
import CheckboxInput from '../CheckboxInput/CheckboxInput';
import ToggleInput from '../ToggleInput/ToggleInput';

const getFieldComponent = (type: string) => {
  switch(type) {
    case 'text':
    case 'string':
      return TextInput;
    case 'number':
      return TextInput;
    case 'select':
      return SelectInput;
    case 'checkbox':
      return CheckboxInput;
    case 'toggle':
      return ToggleInput;
    case 'array':
    case 'complex':
    case 'object':
      return null;
    default:
      return TextInput;
  }
};

interface TableCellProps {
  name: string;
  type: string;
  value: unknown;
  onChange: (value: unknown) => void;
  readOnly: boolean;
  metadata?: FieldMetadata;
}

export const TableCell = ({
  name,
  type,
  readOnly,
  metadata
}: TableCellProps) => {
  const { register, formState: { errors } } = useFormContext();
  const FieldComponent = getFieldComponent(type);
  
  if (FieldComponent === null) {
    return null;
  }

  const fieldError = errors[name] as FieldError | undefined;
  
  const fieldProps = {
    name,
    register,
    error: fieldError,
    disabled: readOnly,
    options: metadata?.type?.kind === 'enum' 
      ? metadata.type.values.map(value => ({
          value,
          label: value,
          disabled: false
        }))
      : [],
    defaultValue: metadata?.defaultValue,
    ...(metadata?.validation && {
      validation: {
        ...(metadata.validation.required && { required: 'This field is required' }),
        ...(metadata.validation.pattern && { 
          pattern: {
            value: new RegExp(metadata.validation.pattern),
            message: 'Invalid pattern'
          }
        }),
        ...(metadata.validation.minLength && { 
          minLength: {
            value: metadata.validation.minLength,
            message: `Minimum length is ${metadata.validation.minLength}`
          }
        }),
        ...(metadata.validation.maxLength && { 
          maxLength: {
            value: metadata.validation.maxLength,
            message: `Maximum length is ${metadata.validation.maxLength}`
          }
        })
      }
    })
  };

  return (
    <FieldComponent
      {...fieldProps}
    />
  );
};
