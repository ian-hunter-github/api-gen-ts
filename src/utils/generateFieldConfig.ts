import { FieldConfig, InputType } from '../components/common/FormBuilder/FormBuilder';
import { ApiConfigMetadata, MetadataRegistry } from '../types/metadata/api-config.meta';
import { generateUUID } from './uuid';
import { ApiConfig } from '../types/all.types';
import { FieldType, FieldMetadata } from '../types/metadata/types';

type FieldTypeMap = {
  [key: string]: InputType;
};

const fieldTypeMap: FieldTypeMap = {
  // Primitive types
  'string': 'text',        // Maps to TextInput component
  'number': 'number',      // Maps to NumberInput component
  'boolean': 'checkbox',   // Maps to CheckboxInput component
  'enum': 'select',        // Maps to SelectInput component
  
  // Special input types
  'textarea': 'textarea',  // Maps to TextArea component
  'datetime': 'datetime',  // Maps to DateTimeInput component
  'date': 'date',          // Maps to DateInput component
  
  // Complex types
  'array': 'table',        // Maps to TableField component for array data
  'object': 'table'        // Maps to TableField component for object data
};

interface FieldMeta {
  component?: string;
  type: FieldType;
  likelyWidthChars?: number;
  validation?: {
    required?: boolean;
    pattern?: string;
  };
  defaultValue?: unknown;
  enumValues?: string[];
  isArray?: boolean;
  isComplex?: boolean;
}

const calculateColSpan = (fieldMeta: FieldMeta): string => {
  const type = typeof fieldMeta.type === 'string' ? fieldMeta.type : 
    fieldMeta.type.kind === 'primitive' ? fieldMeta.type.type :
    fieldMeta.type.kind === 'enum' ? 'enum' :
    'complex';

  switch (type) {
    case 'string':
    case 'enum': {
      const width = fieldMeta.likelyWidthChars ? fieldMeta.likelyWidthChars : 12;
      if (width <= 8) return 'form-group-span-3';
      if (width <= 16) return 'form-group-span-6';
      if (width <= 25) return 'form-group-span-9';
      return 'form-group-span-12';
    }
    case 'number':
      return 'form-group-span-3';
    case 'boolean':
      return 'form-group-span-3';
    case 'datetime':
      return 'form-group-span-6';
    default:
      return 'form-group-span-12';
  }
};

function generateFieldConfig(
  metadata: typeof ApiConfigMetadata & Record<string, FieldMetadata | unknown>,
  visitedTypes: Set<string> = new Set(),
  readOnly: boolean = false
): FieldConfig<ApiConfig>[] {
  try {
    return Object.entries(metadata as typeof ApiConfigMetadata).map(([fieldName, fieldMeta]) => {
      const config: FieldConfig<ApiConfig> = {
        name: fieldName as keyof ApiConfig,
        label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
        type: 'text',
        required: fieldMeta.validation?.required || false,
        defaultValue: fieldMeta.defaultValue,
        placeholder: `Enter ${fieldName}`,
        className: calculateColSpan(fieldMeta),
        isArray: fieldMeta.isArray || (typeof fieldMeta.type === 'object' && fieldMeta.type.kind === 'array'),
        isComplex: fieldMeta.isComplex || (typeof fieldMeta.type === 'object' && fieldMeta.type.kind === 'complex'),
      };

      if (typeof fieldMeta.type === 'string') {
        config.type = fieldTypeMap[fieldMeta.type] || 'text';
      } else {
        switch(fieldMeta.type.kind) {
          case 'primitive':
            config.type = fieldTypeMap[fieldMeta.type.type] || 'text';
            break;
          case 'enum':
            config.type = 'select';
            break;
          case 'array':
            if (fieldMeta.type.itemType.kind === 'primitive') {
              config.type = fieldTypeMap[fieldMeta.type.itemType.type] || 'text';
            } else if (fieldMeta.type.itemType.kind === 'complex') {
              config.type = 'table';
              if (fieldMeta.type.itemType.kind === 'complex') {
                const typeName = fieldMeta.type.itemType.type;
                const typeMetadataKey = `${typeName}Metadata`;
                const typeMetadata = MetadataRegistry[typeMetadataKey as keyof typeof MetadataRegistry];
                
                if (!typeMetadata) {
                  return {
                    name: fieldName as keyof ApiConfig,
                    label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
                    type: 'text',
                    required: false
                  };
                }
                
                if (typeMetadata && typeof typeMetadata === 'object') {
                  config.columns = Object.entries(typeMetadata).map(([key, meta]) => {
                    if (typeof meta !== 'object' || meta === null) {
                      return {
                        key,
                        label: key.charAt(0).toUpperCase() + key.slice(1),
                        type: 'text',
                        width: undefined
                      };
                    }
                    
                    const metaObj = meta as FieldMetadata;
                    const typeInfo = metaObj.type;
                    const likelyWidthChars = metaObj.likelyWidthChars;
                    
                    let typeValue = 'text';
                    if (typeof typeInfo === 'string') {
                      typeValue = typeInfo;
                    } else if (typeof typeInfo === 'object' && typeInfo !== null) {
                      const typeObj = typeInfo as Record<string, unknown>;
                      if (typeObj.kind === 'array') {
                        typeValue = 'array';
                      } else if (typeObj.kind === 'primitive' && typeof typeObj.type === 'string') {
                        typeValue = typeObj.type;
                      } else if (typeObj.kind === 'enum') {
                        typeValue = 'string';
                      } else if (typeObj.kind === 'complex') {
                        typeValue = 'complex';
                      }
                    }
                    
                    return {
                      key,
                      label: key.charAt(0).toUpperCase() + key.slice(1),
                      type: metaObj.isArray ? 'array' : typeValue,
                      width: typeof likelyWidthChars === 'number' ? `${likelyWidthChars * 8}px` : undefined,
                      readOnly
                    };
                  });
                }
              }
            }
            config.isArray = true;
            break;
          case 'complex': {
            config.isComplex = true;
            const typeName = fieldMeta.type.type;
            const typeMetadataKey = `${typeName}Metadata`;
            const typeMetadata = MetadataRegistry[typeMetadataKey as keyof typeof MetadataRegistry];
            
            if (visitedTypes.has(typeName)) {
              return config;
            }

            if (typeMetadata) {
              const newVisited = new Set(visitedTypes);
              newVisited.add(typeName);
              config.nestedFields = generateFieldConfig(
                typeMetadata as typeof ApiConfigMetadata & Record<string, FieldMetadata | unknown>,
                newVisited,
                readOnly
              );
            }
            break;
          }
        }
      }

      if (typeof fieldMeta.type === 'object' && fieldMeta.type.kind === 'enum' && fieldMeta.type.values) {
        config.options = fieldMeta.type.values.map(value => ({
          value,
          label: value.charAt(0).toUpperCase() + value.slice(1)
        }));
      }

      if (fieldMeta.validation?.pattern) {
        config.validation = {
          pattern: {
            value: new RegExp(fieldMeta.validation.pattern),
            message: `Invalid ${fieldName} format`
          }
        };
      }

      if (fieldName === 'id') {
        config.defaultValue = generateUUID();
        config.hidden = true;
      }

      return config;
    });
  } catch {
    return [];
  }
}

export { generateFieldConfig };
