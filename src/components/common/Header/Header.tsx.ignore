import React from 'react';
import { Model } from '../../../utils/Model';
import './Header.css';
import { TableMetadata } from '../Table/Table';

export interface HeaderProps<T extends Record<string, unknown>> {
  model: Model<T>;
  metadata?: TableMetadata<T>;
  onEdit?: (model: Model<T>) => void;
  onDelete?: (model: Model<T>) => void;
  onUndo?: (model: Model<T>) => void;
  onRedo?: (model: Model<T>) => void;
  renderCellContent?: (value: T | null) => React.ReactNode[];
  'data-testid'?: string;
  gridTemplateColumns?: string;
  actionButtonsContent?: React.ReactNode;
}

export function Header<T extends Record<string, unknown>>({
  model,
  metadata,
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

    const cells = filteredEntries.map(([key, val]) => {
      const formatter = metadata?.columnFormatters?.[key as keyof T];
      let formattedValue: React.ReactNode = String(val);
      
      if (formatter && typeof formatter === 'function') {
        try {
          formattedValue = formatter(val);
        } catch (e) {
          console.warn(`Error formatting column ${key}:`, e);
        }
      }
      
      return <span key={key} style={{ fontWeight: 'bold' }}>{formattedValue}</span>;
    });

    // Add Actions as the last cell
    cells.push(<span key="actions">Actions</span>);
    return cells;
  },
}: HeaderProps<T>) {
  const content = renderCellContent(model.current || model.previous);
  const itemName = 'row';

  const rowClass = [
    'row',
    model.status === 'modified' ? 'modified' : '',
    model.status === 'deleted' ? 'deleted' : '',
  ].filter(Boolean).join(' ');

  const rowStyle = {
    gridTemplateColumns: gridTemplateColumns ? `${gridTemplateColumns} 1fr` : undefined,
    backgroundColor: 'var(--header-bg)'
  };

  return (
    <div 
      className={rowClass}
      role="row"
      aria-label={`${itemName} row`}
      data-testid={testId || `row-${model.id}`}
      style={rowStyle}
    >
      {content.map((cell, index) => (
        <div key={index} className="table-cell" role="cell" data-testid={`${itemName}-${model.id}`} style={{ fontWeight: 'bold' }}>
          {cell}
        </div>
      ))}
    </div>
  );
}
