/**
 * Type metadata definitions
 */

export type FieldType = 
  | 'string' | 'number' | 'boolean' | 'date' | 'datetime' 
  | 'object' | 'array' | 'enum';

export interface FieldValidation {
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
}

export interface FieldLayout {
  colSpan?: 3 | 6 | 9 | 12;
  rows?: number;
}

export interface FieldMetadata {
  type: FieldType;
  displayName?: string;
  description?: string;
  validation?: FieldValidation;
  defaultValue?: unknown;
  enumValues?: string[];
  format?: 'date-time' | 'uri' | 'email' | string;
  component?: 'text' | 'textarea' | 'select' | 'checkbox' | 'table' | 'json';
  isArray?: boolean;
  layout?: FieldLayout;
  likelyWidthChars?: number;
  hidden?: boolean;
}
