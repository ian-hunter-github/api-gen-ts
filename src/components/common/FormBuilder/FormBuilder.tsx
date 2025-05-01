import React from 'react';
import { useForm, FieldValues, Path, DefaultValues, FieldError, UseFormRegister, FormProvider, useWatch } from 'react-hook-form';
import { useApiFormContext } from '../../../contexts/ApiFormContext';
import './styles/grid.css';
import './styles/base.css';
import './FormBuilder.css';
import TextInput from './fields/TextInput';
import TextArea from './fields/TextArea';
import SelectInput from './fields/SelectInput';
import CheckboxInput from './fields/CheckboxInput';
import { AccordionField } from './fields/AccordionField/AccordionField';
import { TableField } from './fields/TableField/TableField';

export type InputType = 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'date' | 'time' | 'datetime' | 'checkbox' | 'table';

export interface FieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: InputType;
  span?: number;
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
  hidden?: boolean;
  className?: string;
  rows?: number;
  isArray?: boolean;
  isComplex?: boolean;
  component?: React.FC<{ value: unknown; onChange: (value: unknown) => void }>;
  itemType?: FieldConfig<T>['type'];
  nestedFields?: FieldConfig<T>[];
  columns?: Array<{
    key: string;
    label: string;
    type: string;
    width?: string;
  }>;
}

export interface FormBuilderProps<T extends FieldValues> {
  fields: FieldConfig<T>[];
  initialValues: T;
  onSubmit: (data: T) => void;
  className?: string;
  isNested?: boolean;
  level?: number;
}

const convertFieldToRecordType = <T extends FieldValues>(field: FieldConfig<T>): FieldConfig<Record<string, unknown>> => ({
  ...field,
  name: field.name.toString(),
  nestedFields: field.nestedFields?.map(convertFieldToRecordType)
});

export const FormBuilder = <T extends FieldValues>({
  fields,
  initialValues,
  onSubmit,
  className = '',
  isNested = false,
  level = 1
}: FormBuilderProps<T>) => {
  const { setHasChanges, setHasErrors, readOnly } = useApiFormContext();
  const methods = useForm<T>({
    defaultValues: initialValues as DefaultValues<T>
  });

  const handleFormSubmit = (data: T) => {
    onSubmit(data);
    methods.reset(data);
    setHasChanges(false);
  };

  const { register, handleSubmit, formState: { errors, isDirty } } = methods;
  useWatch({ control: methods.control }); // Track form values for reactivity

  // Update hasChanges when form values change - skip for table operations
  React.useEffect(() => {
    if (!readOnly) {
      setHasChanges(isDirty);
    }
  }, [isDirty, setHasChanges, readOnly]);

  // Update hasErrors when validation errors change - skip for table operations
  React.useEffect(() => {
    if (!readOnly) {
      setHasErrors(Object.keys(errors).length > 0);
    }
  }, [errors, setHasErrors, readOnly]);

  // Removed unused getInputClass function since we're using dedicated components

  const renderInput = (field: FieldConfig<T>, depth = 1) => {
    if (depth > 5) {
      return <div className="max-depth-warning">Maximum recursion depth reached</div>;
    }

  // Handle complex types with Accordion
  if (field.isComplex) {
    return (
      <AccordionField
        name={field.name}
        label={field.label}
        className={field.className}
        level={depth}
        isOpen={field.defaultValue !== undefined}
      >
        {field.nestedFields ? (
          <FormBuilder<Record<string, unknown>>
            fields={field.nestedFields.map(f => convertFieldToRecordType(f))}
            initialValues={(field.defaultValue as Record<string, unknown>) || {}}
            onSubmit={() => {}}
            className={field.className}
            isNested={true}
            level={depth + 1}
          />
        ) : null}
      </AccordionField>
    );
  }

  // Handle table type (both array and table types)
  if (field.type === 'table' || field.isArray) {
    const tableField = (
      <TableField
        name={field.name}
        label={field.label}
        columns={field.columns || field.nestedFields?.map(f => ({
          key: f.name as string,
          label: f.label,
          type: f.type
        })) || []}
        data={Array.isArray(field.defaultValue) ? field.defaultValue : []}
        className={field.className}
        level={depth + 1}
        metadata={field.nestedFields?.reduce((acc, f) => ({
          ...acc,
          [f.name as string]: f
        }), {})}
        metaType={field.itemType}
      />
    );

    // Wrap array tables in accordion
    if (field.isArray) {
      return (
        <AccordionField
          name={field.name}
          label={field.label}
          className={field.className}
          level={depth}
        >
          {tableField}
        </AccordionField>
      );
    }
    return tableField;
  }
    // Remove unused commonProps since we're now using dedicated components

    switch (field.type) {
      case 'textarea':
        return <TextArea 
          name={field.name as string}
          label={field.label}
          register={register as UseFormRegister<FieldValues>}
          required={field.required}
          error={errors[field.name] as FieldError | undefined}
          disabled={field.disabled}
          readOnly={readOnly || methods.formState.isSubmitting}
          className={field.className}
          rows={field.rows}
          validation={field.validation}
        />;
      case 'select':
        return <SelectInput
          name={field.name as string}
          label={field.label}
          register={register as UseFormRegister<FieldValues>}
          required={field.required}
          error={errors[field.name] as FieldError | undefined}
          disabled={field.disabled}
          className={field.className}
          options={field.options || []}
          validation={field.validation}
        />;
      case 'boolean':
        return <CheckboxInput
          name={field.name as string}
          label={field.label}
          register={register as UseFormRegister<FieldValues>}
          required={field.required}
          error={errors[field.name] as FieldError | undefined}
          disabled={field.disabled}
          readOnly={readOnly}
          className={field.className}
          validation={field.validation}
        />;
      default:
        return <TextInput
          name={field.name as string}
          label={field.label}
          register={register as UseFormRegister<FieldValues>}
          required={field.required}
          error={errors[field.name] as FieldError | undefined}
          disabled={field.disabled}
          readOnly={readOnly}
          className={field.className}
          validation={field.validation}
          type={field.type === 'checkbox' ? undefined : field.type}
        />;
    }
  };

  return (
    <div className={`form-builder-container ${className} ${isNested ? 'nested' : ''}`}>
      <FormProvider {...methods}>
        <form 
          onSubmit={handleSubmit(handleFormSubmit)} 
          className="form-grid-container"
        >
        {fields.map(field => (
          !field.hidden && (
            <div key={field.name as string} className={`form-group ${field.className || ''} form-group-span-${field.span || 12}`}>
              {renderInput(field, level)}
              {errors[field.name] && (
                <span className="error-message">
                  {errors[field.name]?.message as string}
                </span>
              )}
            </div>
          )
        ))}
        </form>
      </FormProvider>
    </div>
  );
}
