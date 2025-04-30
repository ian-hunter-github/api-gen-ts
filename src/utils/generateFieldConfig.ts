import { FieldConfig, InputType } from '../components/common/FormBuilder/FormBuilder';
import { ApiConfigMetadata, MetadataRegistry } from '../types/metadata/api-config.meta';
import { generateUUID } from './uuid';
import { ApiConfig } from '../types/all.types';
import { FieldType, FieldMetadata } from '../types/metadata/types';
import { TableFieldAdapter } from '../components/common/FormBuilder/fields/TableField/TableFieldAdapter';
import type { FC } from 'react';

type FieldTypeMap = {
  [key: string]: InputType;
};

const fieldTypeMap: FieldTypeMap = {
  'string': 'text',
  'number': 'number',
  'boolean': 'checkbox',
  'enum': 'select',
  'textarea': 'text',
  'datetime': 'datetime',
  'date': 'date'
};

type ComponentMap = {
  [key: string]: FC<{ value: unknown; onChange: (value: unknown) => void }> | undefined;
};

const componentMap: ComponentMap = {};

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
  // Special case for textarea components
  if (fieldMeta.component === 'textarea') {
    return 'field-col-span-12';
  }

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
  visitedTypes: Set<string> = new Set()
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
        component: fieldName === 'entities' 
          ? TableFieldAdapter
          : fieldMeta.component ? componentMap[fieldMeta.component] : undefined
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
            // For array types, we need to determine the type of the items
            if (fieldMeta.type.itemType.kind === 'primitive') {
              config.type = fieldTypeMap[fieldMeta.type.itemType.type] || 'text';
            } else if (fieldMeta.type.itemType.kind === 'complex') {
              // For complex array items, we'll use the TableFieldAdapter
              config.type = 'table';
              // Handle complex array items (generate table columns from metadata)
              if (fieldMeta.type.itemType.kind === 'complex') {
                const typeName = fieldMeta.type.itemType.type;
                console.log(`Processing complex array type: ${typeName}`);
                
                // Get metadata for the complex type using naming convention
                const typeMetadataKey = `${typeName}Metadata`;
                const typeMetadata = MetadataRegistry[typeMetadataKey as keyof typeof MetadataRegistry];
                
                if (!typeMetadata) {
                  console.warn(`No metadata found for type: ${typeName}`);
                  return {
                    name: fieldName as keyof ApiConfig,
                    label: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
                    type: 'text',
                    required: false
                  };
                }
                
                if (typeMetadata && typeof typeMetadata === 'object') {
                  console.log(`Generating columns for ${typeName}`);
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
                      if (typeObj.kind === 'primitive' && typeof typeObj.type === 'string') {
                        typeValue = typeObj.type;
                      } else if (typeObj.kind === 'enum') {
                        typeValue = 'string';
                      }
                    }
                    
                    return {
                      key,
                      label: key.charAt(0).toUpperCase() + key.slice(1),
                      type: typeValue,
                      width: typeof likelyWidthChars === 'number' ? `${likelyWidthChars * 8}px` : undefined
                    };
                  });
                }
              }
            }
            config.isArray = true;
            break;
          case 'complex': {
            config.isComplex = true;
            // Look up nested metadata for complex types
            const typeName = fieldMeta.type.type;
            console.log(`Processing complex type: ${typeName}`);
            
            // Get metadata for the complex type using naming convention
            const typeMetadataKey = `${typeName}Metadata`;
            const typeMetadata = MetadataRegistry[typeMetadataKey as keyof typeof MetadataRegistry];
            
            if (visitedTypes.has(typeName)) {
              console.warn(`Circular reference detected for type: ${typeName}`);
              return config;
            }

            if (typeMetadata) {
              console.log(`Found nested metadata for ${typeName}`, typeMetadata);
              const newVisited = new Set(visitedTypes);
              newVisited.add(typeName);
              config.nestedFields = generateFieldConfig(
                typeMetadata as typeof ApiConfigMetadata & Record<string, FieldMetadata | unknown>,
                newVisited
              );
            } else {
              console.warn(`No metadata found for complex type: ${typeName}`);
            }
            break;
          }
        }
      }

      // Handle enum values
      if (typeof fieldMeta.type === 'object' && fieldMeta.type.kind === 'enum' && fieldMeta.type.values) {
        config.options = fieldMeta.type.values.map(value => ({
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
  } catch (error) {
    console.error('Error generating field config:', error);
    return [];
  }
}

export { generateFieldConfig };
