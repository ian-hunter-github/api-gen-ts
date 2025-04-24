import { Controller, useFormContext } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import styles from './Form.module.css';

interface TextAreaProps<T extends FieldValues> {
  name: Path<T>;
  control?: Control<T>;
  label: string;
  rules?: import('react-hook-form').RegisterOptions<T>;
}

export const TextArea = <T extends FieldValues>({
  name,
  control,
  label,
  rules,
}: TextAreaProps<T>) => {
  const formContext = useFormContext<T>();
  const actualControl = control || formContext?.control;

  return (
    <Controller
      name={name}
      control={actualControl}
      rules={rules}
      render={({ field, fieldState: { error, isDirty } }) => (
        <div className={`${styles['form-field']} ${error ? styles.error : isDirty ? styles.dirty : ''}`}>
          <label className={styles.label} htmlFor={name}>{label}</label>
          <textarea
            {...field}
            id={name}
            className={styles['form-input']}
            rows={4}
            aria-invalid={!!error}
          />
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
