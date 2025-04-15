import React from 'react';
import { Model } from '../../../utils/Model';
import { ActionButtons } from '../ActionButtons/ActionButtons';
import './Row.css';
import { TableMetadata } from '../Table/Table';

export interface RowProps<T extends Record<string, unknown>> {
  model: Model<T>;
  metadata?: TableMetadata<T>;
  onEdit?: (model: Model<T>) => void;
  onDelete?: (model: Model<T>) => void;
  onUndo?: (model: Model<T>) => void;
  onRedo?: (model: Model<T>) => void;
  renderCellContent?: (value: T | null) => React.ReactNode[];
  'data-testid'?: string;
  gridTemplateColumns?: string;
}

export function Row<T extends Record<string, unknown>>({
  model,
  metadata,
  onEdit,
  onDelete,
  onUndo,
  onRedo,
  'data-testid': testId,
  gridTemplateColumns,
  renderCellContent = (value) => {
    if (!value) return [];
    const entries = Object.entries(value)
      .filter(([key]) => key !== 'id');
    
    // Filter by visibleColumns if metadata provided
    const filteredEntries = metadata?.visibleColumns 
      ? entries.filter(([key]) => metadata.visibleColumns.includes(key as keyof T))
      : entries;

    return filteredEntries.map(([key, val]) => {
      // Apply column formatter if available
      const formatter = metadata?.columnFormatters?.[key as keyof T];
      let formattedValue: React.ReactNode = String(val);
      
      if (formatter && typeof formatter === 'function') {
        try {
          formattedValue = formatter(val);
        } catch (e) {
          console.warn(`Error formatting column ${key}:`, e);
        }
      }
      
      return <span key={key}>{formattedValue}</span>;
    });
  },
}: RowProps<T>) {
  const content = renderCellContent(model.current || model.previous);
  // Standardize labels to match test expectations
  const itemName = 'row';

  const rowClass = [
    'row',
    model.status === 'modified' ? 'modified' : '',
    model.status === 'deleted' ? 'deleted' : '',
  ].filter(Boolean).join(' ');

  return (
      <div 
        className={rowClass}
        role="row"
        aria-label={`${itemName} row`}
        data-testid={testId || `row-${model.id}`}
        style={{ gridTemplateColumns }}
      >
      {content.map((cell, index) => (
        <div key={index} className="table-cell" role="cell" data-testid={`${itemName}-${model.id}`}>
          {cell}
        </div>
      ))}
      {(onEdit || onDelete || onUndo || onRedo) && (
        <div className="table-cell actions" role="cell">
          <ActionButtons
            model={model}
            onEdit={onEdit}
            onDelete={onDelete}
            onUndo={onUndo}
            onRedo={onRedo}
          />
        </div>
      )}
    </div>
  );
}
