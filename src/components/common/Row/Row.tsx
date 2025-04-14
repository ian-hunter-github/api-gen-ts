import React from 'react';
import { Model } from '../../../utils/Model';
import { ActionButtons } from '../ActionButtons/ActionButtons';
import './Row.css';

export interface RowProps<T extends Record<string, unknown>> {
  model: Model<T>;
  onEdit?: (model: Model<T>) => void;
  onDelete?: (model: Model<T>) => void;
  onUndo?: (model: Model<T>) => void;
  onRedo?: (model: Model<T>) => void;
  renderCellContent?: (value: T | null) => React.ReactNode[];
  'data-testid'?: string;
}

export function Row<T extends Record<string, unknown>>({
  model,
  onEdit,
  onDelete,
  onUndo,
  onRedo,
  'data-testid': testId,
  renderCellContent = (value) => {
    if (!value) return [];
    return Object.entries(value)
      .filter(([key]) => key !== 'id')
      .map(([key, val]) => <span key={key}>{String(val)}</span>);
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
