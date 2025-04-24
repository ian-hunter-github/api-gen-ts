import styles from './Form.module.css';
import { Controller, useFormContext } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface CheckboxInputProps<T extends FieldValues> {
  name: Path<T>;
  control?: Control<T>;
  label: string;
  rules?: import('react-hook-form').RegisterOptions<T>;
}

export const CheckboxInput = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
}: CheckboxInputProps<T>) => {
  const formContext = useFormContext<T>();
  const actualControl = control || formContext?.control;

  return (
    <Controller
      name={name}
      control={actualControl}
      rules={rules}
      render={({ field, fieldState: { error, isDirty } }) => (
        <div className={`${styles['form-field']} ${error ? styles.error : isDirty ? styles.dirty : ''}`}>
          <label className={styles.label}>
            <input
              {...field}
              type="checkbox"
              checked={field.value || false}
              className={styles['form-input']}
              aria-invalid={!!error}
            />
            {label}
          </label>
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
