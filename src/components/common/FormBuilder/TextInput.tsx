import styles from './Form.module.css';
import { Controller, useFormContext } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface TextInputProps<T extends FieldValues> {
  name: Path<T>;
  control?: Control<T>;
  label: string;
  rules?: import('react-hook-form').RegisterOptions<T>;
}

export const TextInput = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
}: TextInputProps<T>) => {
  const formContext = useFormContext<T>();
  const actualControl = control || formContext?.control;

  return (
    <Controller
      name={name}
      control={actualControl}
      rules={rules}
      render={({ field, fieldState: { error, isDirty } }) => (
        <div className={`${styles['form-field']} ${error ? styles.error : isDirty ? styles.dirty : ''}`}>
          <input
            {...field}
            type="text"
            id={name}
            className={styles['form-input']}
            aria-invalid={!!error}
          />
          <label className={styles.label} htmlFor={name}>{label}</label>
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
