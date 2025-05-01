import React, { ReactNode, JSX, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { useApiFormContext } from '../../../../../contexts/ApiFormContext';
import './AccordionField.css';

export interface AccordionFieldProps<T extends FieldValues> {
  name: keyof T;
  label: string;
  children: ReactNode;
  className?: string;
  level?: number;
  isOpen?: boolean;
}

export const AccordionField = <T extends FieldValues>({
  name,
  label,
  children,
  className = '',
  level = 0,
  isOpen = false
}: AccordionFieldProps<T>): JSX.Element => {
  const [open, setOpen] = useState(isOpen);

  const { setHasChanges, setHasErrors } = useApiFormContext();

  return (
    <div className={`accordion-field level-${level} ${className}`} data-field-name={name}>
      <div 
        className="accordion-header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{ cursor: 'pointer' }}
      >
        <h3 className="accordion-label">{label}</h3>
        <span className="accordion-icon">{open ? '−' : '+'}</span>
      </div>
      {open && (
        <div className="accordion-content">
          {React.Children.map(children, child => {
            if (React.isValidElement<{
              readOnly?: boolean;
              onChange?: (event: React.ChangeEvent<HTMLElement>) => void;
              onError?: (hasError: boolean) => void;
            }>(child)) {
              return React.cloneElement(child, {
                ...child.props,
                onChange: (event: React.ChangeEvent<HTMLElement>) => {
                  setHasChanges(true);
                  child.props.onChange?.(event);
                },
                onError: (hasError: boolean) => {
                  setHasErrors(hasError);
                  child.props.onError?.(hasError);
                }
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};
