import { ReactNode, JSX, useState, useEffect, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';
import { useApiFormContext } from '../../../../../contexts/ApiFormContext';
import './TableField.css';

import { FieldMetadata } from '../../../../../types/metadata/types';
import { generateUUID } from '../../../../../utils/uuid';
import { initializeApiEntity } from '../../../../../types/defaults';

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

  const [rows, setRows] = useState<T[keyof T][]>(data);
  const [prevTableErrors, setPrevTableErrors] = useState(false);
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [newRowIds, setNewRowIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isAddingRow) return;
    
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
  }, [rows, metadata, setHasErrors, isAddingRow, newRowIds]);

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

  if (!derivedColumns.length) {
    throw new Error('TableField requires either columns or metadata prop');
  }

  const handleAddRow = () => {
    if (readOnly) return;
    
    let newRow: T[keyof T];
    if (metaType === 'ApiEntity') {
      newRow = initializeApiEntity() as T[keyof T];
      derivedColumns.forEach(column => {
        if (column.type === 'string' && !newRow[column.key] && metadata?.[column.key]?.defaultValue) {
          (newRow as Record<string, string>)[column.key] = metadata[column.key].defaultValue as string;
        }
      });
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
    }

    const rowWithId = { ...newRow, id: generateUUID() };
    
    setIsAddingRow(true);
    try {
      const updatedRows = [...rows, rowWithId];
      setRows(updatedRows);
      setNewRowIds(prev => new Set(prev).add(rowWithId.id));
      setHasChanges(true);
    } catch (error) {
      console.error('Error adding row:', error);
      throw error;
    } finally {
      setIsAddingRow(false);
      setNewRowIds(prev => {
        const updated = new Set(prev);
        updated.delete(rowWithId.id);
        return updated;
      });
    }
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
                    {column.type === 'boolean' ? (
                      <input 
                        type="checkbox"
                        checked={!!(row as Record<string, boolean>)[column.key]}
                        onChange={(e) => {
                          if (!readOnly) {
                            const updatedRows = [...rows];
                            (updatedRows[rowIndex] as Record<string, boolean>)[column.key] = e.target.checked;
                            setRows(updatedRows);
                            setHasChanges(true);
                          }
                        }}
                        disabled={readOnly}
                        style={{
                          cursor: readOnly ? 'not-allowed' : 'pointer',
                          opacity: readOnly ? 0.6 : 1
                        }}
                      />
                    ) : column.type === 'complex' ? (
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
                      >
                        {readOnly ? 'View' : 'Edit'} {column.label}
                      </button>
                    ) : column.type === 'array' ? (
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
                      >
                        View {column.label} ({((row as Record<string, unknown[]>)[column.key] as unknown[] || []).length})
                      </button>
                    ) : column.type === 'string' ? (
                      <input
                        type="text"
                        value={(row as Record<string, string>)[column.key] ?? ''}
                        onChange={(e) => {
                          if (!readOnly) {
                            const updatedRows = [...rows];
                            (updatedRows[rowIndex] as Record<string, string>)[column.key] = e.target.value;
                            setRows(updatedRows);
                            setHasChanges(true);
                          }
                        }}
                        disabled={readOnly}
                        style={{
                          width: '100%',
                          padding: '4px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: readOnly ? 'not-allowed' : 'text',
                          opacity: readOnly ? 0.6 : 1
                        }}
                      />
                    ) : (
                      (row as Record<string, ReactNode>)[column.key] ?? ''
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
    </div>
  );
};
