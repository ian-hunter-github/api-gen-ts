import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  Table
} from '@tanstack/react-table';
import './TanStackTable.css';

export type EnhancedColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  editable?: boolean;
  cellType?: 'text' | 'number' | 'boolean' | 'select' | 'date' | 'time' | 'datetime' | 'dropdown' | 'custom';
  cellOptions?: {
    selectOptions?: {value: string, label: string}[];
    options?: {value: string, label: string}[]; // For dropdown
    dateFormat?: string;
    timeFormat?: string;
    datetimeFormat?: string;
    format?: string; // For datetime picker
    minDate?: Date;
    maxDate?: Date;
    onChange?: (value: TValue) => void;
    customRenderer?: (value: TValue, row: TData) => React.ReactNode;
  };
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
    getRowData?: (rowIndex: number) => TData;
    onDelete?: (row: TData) => void;
    onBulkDelete?: (rows: TData[]) => void;
  }
}

interface TanStackTableProps<T extends Record<string, unknown> & { id: string }> {
  data: T[];
  columns: EnhancedColumnDef<T>[];
  onRowClick?: (row: T) => void;
  onCellEdit?: (rowId: string, columnId: string, value: unknown) => void;
  onRowAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onBulkDelete?: (rows: T[]) => void;
  onUndo?: (row: T) => void;
  onRedo?: (row: T) => void;
  editable?: boolean;
  showActions?: boolean;
  enableRowSelection?: boolean;
  className?: string;
  validationErrors?: Record<string, string>;
  enableSorting?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  isLoading?: boolean;
  metadata?: {
    visibleColumns?: string[];
    columnFormatters?: Record<string, (value: unknown) => React.ReactNode>;
  };
}

export function TanStackTable<T extends Record<string, unknown> & { id: string }>({
  data,
  columns,
  onRowClick,
  onCellEdit,
  onRowAdd,
  onEdit,
  onDelete,
  onBulkDelete,
  onUndo,
  onRedo,
  editable = false,
  showActions = false,
  enableRowSelection = false,
  className = '',
  validationErrors = {},
}: TanStackTableProps<T>) {
  const [editingCell, setEditingCell] = useState<{rowId: string, columnId: string} | null>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const table = useReactTable({
    data,
    state: {
      rowSelection,
    },
    meta: {
      onDelete,
      onBulkDelete
    },
    onRowSelectionChange: setRowSelection,
    getRowId: (row: T) => row.id as string,
    columns: [
      ...(enableRowSelection ? [{
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      } as ColumnDef<T>] : []),
      ...columns as ColumnDef<T>[],
      ...(showActions ? [{
        id: 'actions',
        header: 'Actions',
                cell: ({row, table}: {row: {original: T}, table: Table<T>}) => (
                  <div className="table-actions">
                    {onEdit && (
                      <button 
                        className="table-action-button edit"
                        onClick={() => onEdit(row.original)}
                        title="Edit"
                      >
                        <span className="button-icon">✏️</span>
                        <span className="button-text">Edit</span>
                      </button>
                    )}
                    {onDelete && table.options.meta?.onDelete && (
                      <button 
                        className="table-action-button delete"
                        onClick={() => {}}
                        title="Delete"
                      >
                        <span className="button-icon">🗑️</span>
                        <span className="button-text">Delete</span>
                      </button>
                    )}
            {onUndo && (
              <button 
                className="table-action-button undo"
                onClick={() => onUndo(row.original)}
                title="Undo"
              >
                <span className="button-icon">↩️</span>
                <span className="button-text">Undo</span>
              </button>
            )}
            {onRedo && (
              <button 
                className="table-action-button redo"
                onClick={() => onRedo(row.original)}
                title="Redo"
              >
                <span className="button-icon">↪️</span>
                <span className="button-text">Redo</span>
              </button>
            )}
          </div>
        )
      } as ColumnDef<T>] : [])
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  const handleCellDoubleClick = (rowId: string, columnId: string) => {
    if (editable) {
      setEditingCell({rowId, columnId});
    }
  };

  const handleCellBlur = (rowId: string, columnId: string, value: unknown) => {
    if (editingCell) {
      onCellEdit?.(rowId, columnId, value);
      setEditingCell(null);
    }
  };

  const handleBulkDelete = () => {
    const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
    if (selectedRows.length > 0 && onBulkDelete && table.options.meta?.onBulkDelete) {
      table.options.meta.onBulkDelete(selectedRows);
      setRowSelection({});
    }
  };

  return (
    <div className={`tanstack-table ${className}`}>
      <div className="table-controls">
        {onRowAdd && (
          <button className="add-row-button" onClick={onRowAdd}>
            Add Row
          </button>
        )}
                  {enableRowSelection && onBulkDelete && table.options.meta?.onBulkDelete && (
                    <button 
                      className="bulk-delete-button"
                      onClick={handleBulkDelete}
                      disabled={Object.keys(rowSelection).length === 0}
                    >
                      Delete Selected
                    </button>
                  )}
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr 
              key={row.id}
              onClick={() => onRowClick?.(row.original)}
              className={validationErrors[row.id] ? 'error-row' : ''}
            >
              {row.getVisibleCells().map(cell => {
                const columnDef = cell.column.columnDef as EnhancedColumnDef<T>;
                const isEditing = editingCell?.rowId === row.id && 
                                editingCell?.columnId === cell.column.id;

                const cellValue = cell.getValue();
                
                return (
                  <td 
                    key={cell.id}
                    onDoubleClick={() => handleCellDoubleClick(row.id, cell.column.id)}
                  >
                    {isEditing ? (
                      columnDef.cellType === 'datetime' ? (
                        <input
                          type="datetime-local"
                          defaultValue={cellValue as string}
                          onChange={(e) => handleCellBlur(row.id, cell.column.id, e.target.value)}
                          autoFocus
                        />
                      ) : columnDef.cellType === 'dropdown' && columnDef.cellOptions?.options ? (
                        <select
                          defaultValue={cellValue as string}
                          onChange={(e) => handleCellBlur(row.id, cell.column.id, e.target.value)}
                          autoFocus
                        >
                          {columnDef.cellOptions.options.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          defaultValue={String(cellValue)}
                          onBlur={(e) => handleCellBlur(row.id, cell.column.id, e.target.value)}
                          autoFocus
                        />
                      )
                    ) : (
                      columnDef.cellOptions?.customRenderer ? 
                        columnDef.cellOptions.customRenderer(cellValue, row.original) :
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
