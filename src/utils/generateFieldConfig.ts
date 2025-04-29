import { FieldConfig } from '../components/common/FormBuilder/FormBuilder';
import { ApiConfigMetadata } from '../types/metadata/api-config.meta';
import { generateUUID } from './uuid';
import { ApiConfig } from '../types/all.types';

type FieldTypeMap = {
  [key: string]: 'text' | 'number' | 'checkbox' | 'select' | 'textarea' | 'datetime';
};

const fieldTypeMap: FieldTypeMap = {
  'string': 'text',
  'number': 'number',
  'boolean': 'checkbox',
  'enum': 'select',
  'textarea': 'textarea',
  'datetime': 'datetime'
};

interface FieldMeta {
  component?: string;
  type: string;
  likelyWidthChars?: number;
  validation?: {
    required?: boolean;
    pattern?: string;
  };
  defaultValue?: unknown;
  enumValues?: string[];
}

const calculateColSpan = (fieldMeta: FieldMeta): string => {

  
  switch (fieldMeta.type) {
    case 'string':
    case 'enum': {
      const width = fieldMeta.likelyWidthChars ? fieldMeta.likelyWidthChars : 12;
      if (width <= 8) return 'field-col-span-3';
      if (width <= 16) return 'field-col-span-6';
      if (width <= 25) return 'field-col-span-9';
      return 'field-col-span-12';
    }
    case 'number':
      return 'field-col-span-3';
    case 'boolean':
      return 'field-col-span-3';
    case 'textarea':
      return 'field-col-span-12';
    case 'datetime':
      return 'field-col-span-6';
    default:
      return 'field-col-span-12';
  }
};


export const generateFieldConfig = (metadata: typeof ApiConfigMetadata): FieldConfig<ApiConfig>[] => {
  return Object.entries(metadata).map(([fieldName, fieldMeta]) => {
    const config: FieldConfig<ApiConfig> = {
      name: fieldName as keyof ApiConfig,
      label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
      type: fieldTypeMap[fieldMeta.component || fieldMeta.type] || 'text',
      required: fieldMeta.validation?.required || false,
      defaultValue: fieldMeta.defaultValue,
      placeholder: `Enter ${fieldName}`,
      className: calculateColSpan(fieldMeta)
    };

    // Handle enum values
    if (fieldMeta.type === 'enum' && fieldMeta.enumValues) {
      config.options = fieldMeta.enumValues.map(value => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1)
      }));
    }

    // Handle validation patterns
    if (fieldMeta.validation?.pattern) {
      config.validation = {
        pattern: {
          value: new RegExp(fieldMeta.validation.pattern),
          message: `Invalid ${fieldName} format`
        }
      };
    }

    // Special handling for ID field
    if (fieldName === 'id') {
      config.defaultValue = generateUUID();
      config.hidden = true;
    }

    return config;
  });
};
