/**
 * Entity attribute types
 */
export type AttributeType = 
  | 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'timestamp' | 'uuid'
  | 'object' | 'array' | 'reference' | 'enum';

export type EntityAttribute = {
  name: string;
  type: AttributeType;
  required?: boolean;
  unique?: boolean;
  default?: string | number | boolean | Date | object | unknown[];
  description?: string;
  enumValues?: string[];
  values?: string[]; // Alias for enumValues for backward compatibility
  items?: Omit<EntityAttribute, 'items'>; // For array types, this is the type of the items in the array
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
};
