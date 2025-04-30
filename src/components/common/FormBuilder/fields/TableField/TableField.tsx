import { ReactNode, JSX, useState, useEffect, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';
import './TableField.css';

import { FieldMetadata } from '../../../../../types/metadata/types';

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
  metaType
}: TableFieldProps<T>): JSX.Element => {
  const derivedColumns = useMemo(() => 
    metadata && metaType 
      ? Object.entries(metadata).map(([key, field]) => ({
          key,
          label: field.displayName || key.charAt(0).toUpperCase() + key.slice(1),
          type: field.type.kind === 'primitive' 
            ? field.type.type 
            : field.type.kind,
          width: field.likelyWidthChars ? `${field.likelyWidthChars}ch` : undefined
        }))
      : columns || [],
    [metadata, metaType, columns]
  );

  if (!derivedColumns.length) {
    throw new Error('TableField requires either columns or metadata prop');
  }
  useEffect(() => {
    // Debug logging removed
  }, [name, label, columns, data, className, level]);
  const [rows, setRows] = useState<T[keyof T][]>(data);

  useEffect(() => {
    // Debug logging removed
  }, [name, metadata, metaType, derivedColumns, data, rows]);

  const handleAddRow = () => {
    const newRow = derivedColumns.reduce((acc, column) => {
      // Set default values based on column type and metadata
      if (column.type === 'number') {
        acc[column.key] = 0;
      } else if (column.type === 'boolean') {
        acc[column.key] = false;
      } else if (column.type === 'complex') {
        acc[column.key] = metadata?.[column.key]?.defaultValue 
          ? { ...metadata[column.key].defaultValue as object }
          : {};
      } else if (column.type === 'array') {
        acc[column.key] = [];
      } else {
        acc[column.key] = '';
      }
      return acc;
    }, {} as T[keyof T]);
    setRows([...rows, newRow]);
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
                    {metadata?.[column.key]?.component === 'table' ? (
                      <div style={{ fontSize: '0.8em' }}>
                        {Array.isArray((row as Record<string, unknown>)[column.key]) 
                          ? `${((row as Record<string, unknown[]>)[column.key] as unknown[]).length} items`
                          : 'Invalid data'}
                      </div>
                    ) : column.type === 'boolean' ? (
                      <input 
                        type="checkbox"
                        checked={!!(row as Record<string, boolean>)[column.key]}
                        onChange={(e) => {
                          const updatedRows = [...rows];
                          (updatedRows[rowIndex] as Record<string, boolean>)[column.key] = e.target.checked;
                          setRows(updatedRows);
                        }}
                      />
                    ) : column.type === 'complex' ? (
                      <pre style={{ margin: 0, fontSize: '0.8em' }}>
                        {JSON.stringify((row as Record<string, unknown>)[column.key], null, 2)}
                      </pre>
                    ) : column.type === 'array' ? (
                      <div style={{ fontSize: '0.8em' }}>
                        {((row as Record<string, unknown[]>)[column.key] as unknown[] || []).length} items
                      </div>
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
        className="add-row-btn" 
        onClick={handleAddRow}
        style={{
          marginTop: '12px',
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        + Add Row
      </button>
    </div>
  );
};
