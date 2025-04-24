import styles from './Form.module.css';
import { Controller, useFormContext } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface SelectInputProps<T extends FieldValues> {
  name: Path<T>;
  control?: Control<T>;
  label: string;
  options?: { value: string; label: string }[];
  rules?: import('react-hook-form').RegisterOptions<T>;
}

export const SelectInput = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  rules,
}: SelectInputProps<T>) => {
  const formContext = useFormContext<T>();
  const actualControl = control || formContext?.control;

  return (
    <Controller
      name={name}
      control={actualControl}
      rules={rules}
      render={({ field, fieldState: { error, isDirty } }) => (
        <div className={`${styles['form-field']} ${error ? styles.error : isDirty ? styles.dirty : ''}`}>
          <label className={styles.label} htmlFor={name}>
            {label}
          </label>
          <select
            {...field}
            id={name}
            className={styles['form-input']}
            aria-invalid={!!error}
            value={field.value || ''}
          >
            <option value="">Select an option</option>
            {(options || []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && (
            <span className={styles['form-error']}>
              {error.message}
            </span>
          )}
        </div>
      )}
    />
  );
};
