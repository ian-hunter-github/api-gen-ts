import React from 'react';
import { Model } from '../../../utils/Model';
import './Row.css';

export interface RowProps<T extends Record<string, unknown>> {
  model: Model<T>;
  onEdit?: (model: Model<T>) => void;
  onDelete?: (model: Model<T>) => void;
  onUndo?: (model: Model<T>) => void;
  onRedo?: (model: Model<T>) => void;
  renderCellContent?: (value: T | null) => React.ReactNode[];
}

export function Row<T extends Record<string, unknown>>({
  model,
  onEdit,
  onDelete,
  onUndo,
  onRedo,
  renderCellContent = (value) => {
    if (!value) return [];
    return Object.entries(value)
      .filter(([key]) => key !== 'id')
      .map(([key, val]) => <span key={key}>{String(val)}</span>);
  },

}: RowProps<T>) {
  const content = renderCellContent(model.current);

  const rowClass = model.status === 'modified' ? 'table-row modified' : 'table-row';
  return (
    <div className={rowClass} id={model.id}>
      {content.map((cell, index) => (
        <div key={index} className="table-cell">
          {cell}
        </div>
      ))}
      {(onEdit || onDelete || onUndo || onRedo) && (
        <div className="table-cell actions">
          {onEdit && (
            <button 
              onClick={() => onEdit(model)} 

              aria-label={model.current && 'name' in model.current ? `Edit ${model.current.name}` : 'Edit row'}
              disabled={model.status === 'deleted'}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(model)} 

              aria-label={model.current && 'name' in model.current ? `Delete ${model.current.name}` : 'Delete row'}
              disabled={model.status === 'deleted'}
            >
              Delete
            </button>
          )}
          {onUndo && (
            <button 
              onClick={() => onUndo(model)} 

              aria-label="Undo row"
              disabled={!model.canUndo}
            >
              Undo
            </button>
          )}
          {onRedo && (
            <button 
              onClick={() => onRedo(model)} 

              aria-label="Redo row"
              disabled={!model.canRedo}
            >
              Redo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
