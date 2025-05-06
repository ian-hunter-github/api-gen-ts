import { JSX, useState, useEffect, useMemo } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { useApiFormContext } from '../../../../../contexts/ApiFormContext';
import './TableField.css';

import { FieldMetadata } from '../../../../../types/metadata/types';
import { generateUUID } from '../../../../../utils/uuid';
import type * as Defaults from '../../../../../types/defaults';
import { FormBuilder, InputType } from '../../FormBuilder';
import TextInput from '../TextInput/TextInput';
import SelectInput from '../SelectInput/SelectInput';
import CheckboxInput from '../CheckboxInput/CheckboxInput';
import ToggleInput from '../ToggleInput/ToggleInput';

import { TableCell } from './TableCell';

const getFieldComponent = (type: string) => {
  switch(type) {
    case 'text':
    case 'string':
      return TextInput;
    case 'number':
      return TextInput;
    case 'select':
      return SelectInput;
    case 'checkbox':
      return CheckboxInput;
    case 'toggle':
      return ToggleInput;
    case 'array':
    case 'complex':
    case 'object':
      return null; // Will be handled with button
    default:
      return TextInput;
  }
};


export interface TableFieldProps<T extends FieldValues> {
  name: keyof T;
  label: string;
  columns?: Array<{
    key: string;
    label: string;
    type: string;
    width?: string;
  }>;
  data?: T[keyof T][];
  className?: string;
  level?: number;
  metadata?: Record<string, FieldMetadata>;
  metaType?: string;
}

export const TableField = <T extends FieldValues>({
  name,
  label,
  columns,
  data = [],
  className = '',
  level = 0,
  metadata,
  metaType,
}: TableFieldProps<T>): JSX.Element => {
  const { readOnly, setHasChanges, setHasErrors } = useApiFormContext();
  
  useEffect(() => {
  }, [readOnly, name]);

  const [rows, setRows] = useState<T[keyof T][]>(data || []);
  const [prevTableErrors, setPrevTableErrors] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<{
    title: string;
    value: unknown;
    type: string;
    onChange: (value: unknown) => void;
  } | null>(null);
  const [newRowIds, setNewRowIds] = useState<Set<string>>(new Set());
  const { setValue } = useFormContext();

  useEffect(() => {
    const hasErrors = rows.some(row => {
      if (metadata) {
        return Object.entries(metadata).some(([key, field]) => {
          if (newRowIds.has(row.id as string)) return false;
          if (field.validation?.required && !(row as Record<string, unknown>)[key]) {
            return true;
          }
          return false;
        });
      }
      return false;
    });
    
    if (hasErrors !== prevTableErrors) {
      setHasErrors(hasErrors);
      setPrevTableErrors(hasErrors);
    }
  }, [rows, metadata, setHasErrors, newRowIds, prevTableErrors]);

  const derivedColumns = useMemo(() => {
    const cols = metadata && metaType 
      ? Object.entries(metadata).map(([key, field]) => {
          const type = field.type.kind === 'primitive' 
            ? field.type.type 
            : field.type.kind;
          console.log(`Column config for ${key}:`, {
            key,
            label: field.displayName || key.charAt(0).toUpperCase() + key.slice(1),
            type,
            width: field.likelyWidthChars ? `${field.likelyWidthChars}ch` : undefined
          });
          return {
            key,
            label: field.displayName || key.charAt(0).toUpperCase() + key.slice(1),
            type,
            width: field.likelyWidthChars ? `${field.likelyWidthChars}ch` : undefined
          };
        })
      : columns || [];
    console.log('Final derived columns:', cols);
    return cols;
  }, [metadata, metaType, columns]);

  useEffect(() => {
    if (rows.length > 0) {
      rows.forEach((row, rowIndex) => {
        derivedColumns.forEach(column => {
          console.log(`Rendering cell for row ${rowIndex}, column ${column.key} (type: ${column.type})`, {
            value: row[column.key],
            isArray: Array.isArray(row[column.key])
          });
        });
      });
    }
  }, [rows, derivedColumns]);

  if (!derivedColumns?.length) {
    return <div className="table-field-error">No columns defined for table</div>;
  }

  const handleAddRow = async () => {
    if (readOnly) return;
    
    console.log('Adding new row with metaType:', metaType);
    let newRow: T[keyof T];
    if (metaType) {
      const initializeFn = `initialize${metaType}` as keyof typeof Defaults;
      const defaults = await import('../../../../../types/defaults');
      if (!defaults[initializeFn]) {
        throw new Error(`Initializer function ${initializeFn} not found in defaults.ts`);
      }
      const baseEntity = defaults[initializeFn](() => ({}), metadata ? metadata as Partial<object> : {});
      console.log(`Base ${metaType} structure:`, baseEntity);
      newRow = { 
        ...baseEntity as T[keyof T],
        id: generateUUID(),
        // Ensure all required fields have values
        ...(derivedColumns.reduce((acc, column) => {
          const baseEntityRecord = baseEntity as unknown as Record<string, unknown>;
          if (metadata?.[column.key]?.validation?.required && 
              !baseEntityRecord[column.key]) {
            (acc as Record<string, unknown>)[column.key] = 
              metadata[column.key]?.defaultValue ?? 
              (column.type === 'number' ? 0 : 
               column.type === 'boolean' ? false : 
               column.type === 'array' ? [] : 
               column.type === 'complex' ? {} : '');
          }
          return acc;
        }, {} as Record<string, unknown>))
      };
      console.log('New row after processing columns:', newRow);
    } else {
      newRow = derivedColumns.reduce((acc, column) => {
        if (metadata?.[column.key]?.defaultValue !== undefined) {
          acc[column.key] = metadata[column.key].defaultValue;
        } else if (column.type === 'number') {
          acc[column.key] = 0;
        } else if (column.type === 'boolean') {
          acc[column.key] = false;
        } else if (column.type === 'complex') {
          acc[column.key] = {};
        } else if (column.type === 'array') {
          acc[column.key] = [];
        } else {
          acc[column.key] = '';
        }
        return acc;
      }, {} as T[keyof T]);
      newRow = { ...newRow, id: generateUUID() };
    }

    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    setNewRowIds(prev => new Set(prev).add(newRow.id));
    
    // Update form state
    setValue(name as string, updatedRows, { shouldDirty: true });
    setHasChanges(true);
  };

  return (
    <div className={`table-field level-${level} ${className}`} data-field-name={name}>
      <h3 className="table-label">{label}</h3>
      <table className="form-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {derivedColumns.map(column => (
              <th 
                key={column.key} 
                style={{ 
                  width: column.width,
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                  backgroundColor: '#f2f2f2'
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td 
                colSpan={derivedColumns.length} 
                style={{ 
                  textAlign: 'center',
                  border: '1px solid #ddd',
                  padding: '12px',
                  color: '#666'
                }}
              >
                No data available. Click "Add Row" to start.
              </td>
            </tr>
          )}
          {rows.length > 0 && (
            rows.map((row: T[keyof T], rowIndex) => (
              <tr key={rowIndex}>
                {derivedColumns.map(column => (
                  <td 
                    key={column.key} 
                    className={`table-cell-${column.type}`}
                    style={{
                      border: '1px solid #ddd',
                      padding: '8px'
                    }}
                  >
                    {getFieldComponent(column.type) === null ? (
                      <button
                        disabled={readOnly}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#f0f0f0',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          cursor: readOnly ? 'not-allowed' : 'pointer',
                          opacity: readOnly ? 0.6 : 1
                        }}
                        onClick={() => {
                          if (readOnly) return;
                          const nestedValue = (row as Record<string, unknown>)[column.key];
                          setDialogContent({
                            title: column.label,
                            value: nestedValue,
                            type: column.type,
                            onChange: (value: unknown) => {
                              const updatedRows = [...rows];
                              (updatedRows[rowIndex] as Record<string, unknown>)[column.key] = value;
                              setRows(updatedRows);
                              setHasChanges(true);
                            }
                          });
                          setDialogOpen(true);
                        }}
                      >
                        {column.label}...
                      </button>
                    ) : (
                      <TableCell
                      name={`${String(name)}.${rowIndex}.${column.key}`}
                      type={column.type}
                      value={(row as Record<string, unknown>)[column.key]}
                      onChange={(value: unknown) => {
                        if (!readOnly) {
                          const updatedRows = [...rows];
                          (updatedRows[rowIndex] as Record<string, unknown>)[column.key] = value;
                          setRows(updatedRows);
                          setHasChanges(true);
                        }
                      }}
                      readOnly={readOnly}
                      metadata={metadata?.[column.key]}
                    />
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button 
        className={`add-row-btn ${readOnly ? 'disabled' : ''}`}
        onClick={handleAddRow}
        disabled={readOnly}
        aria-disabled={readOnly}
        style={{
          marginTop: '12px',
          padding: '8px 16px',
          backgroundColor: readOnly ? '#cccccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: readOnly ? 'not-allowed' : 'pointer',
          opacity: readOnly ? 0.6 : 1
        }}
      >
        + Add Row
      </button>

      {dialogOpen && dialogContent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3>{dialogContent.title}</h3>
              <div>
                <FormBuilder
                  fields={[{
                    name: 'nestedValue',
                    label: dialogContent.title,
                    type: dialogContent.type as InputType,
                    defaultValue: dialogContent.value,
                    ...(metadata?.[dialogContent.title.toLowerCase()]?.validation && {
                      validation: {
                        ...(metadata[dialogContent.title.toLowerCase()].validation?.required && { 
                          required: metadata[dialogContent.title.toLowerCase()].validation?.required 
                        }),
                        ...(metadata[dialogContent.title.toLowerCase()].validation?.pattern && { 
                          pattern: { 
                            value: new RegExp(metadata[dialogContent.title.toLowerCase()].validation?.pattern || ''),
                            message: 'Invalid pattern'
                          }
                        }),
                        ...(metadata[dialogContent.title.toLowerCase()].validation?.minLength && { 
                          minLength: metadata[dialogContent.title.toLowerCase()].validation?.minLength 
                        }),
                        ...(metadata[dialogContent.title.toLowerCase()].validation?.maxLength && { 
                          maxLength: metadata[dialogContent.title.toLowerCase()].validation?.maxLength 
                        })
                      }
                    })
                  }]}
                  initialValues={{ nestedValue: dialogContent.value }}
                  onSubmit={(values: { nestedValue: unknown }) => {
                    dialogContent.onChange(values.nestedValue);
                    setDialogOpen(false);
                  }}
                  isNested={true}
                />
                <button 
                  onClick={() => setDialogOpen(false)}
                  style={{
                    marginTop: '16px',
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            )
          </div>
        </div>
      )}
    </div>
  );
};
