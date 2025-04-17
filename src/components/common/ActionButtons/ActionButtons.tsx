import React from 'react';
import { Model } from '../../../utils/Model';
import './ActionButtons.css';

export interface ActionButtonsProps<T extends Record<string, unknown> = Record<string, unknown>> {
  model: Model<T>;
  onEdit?: (model: Model<T>) => void;
  onDelete?: (model: Model<T>) => void;
  onUndo?: (model: Model<T>) => void;
  onRedo?: (model: Model<T>) => void;
  containerComponent?: React.ElementType;
}

export function ActionButtons<T extends Record<string, unknown>>({
  model,
  onEdit,
  onDelete,
  onUndo,
  onRedo,
  containerComponent: Container = 'div',
}: ActionButtonsProps<T>) {
  const handleDelete = (model: Model<T>) => {
    model.delete();
    onDelete?.(model);
  };

  return (
    <Container className="actions">
      {onEdit && (
        <button 
          onClick={() => onEdit(model)}
          aria-label="Edit row"
          data-testid={`action-edit-btn-${model.id}`}
          className={`action-button edit ${model.status === 'deleted' ? 'disabled' : ''}`}
          disabled={model.status === 'deleted'}
          title="Edit"
        >
          <span className="icon">✏️</span>
        </button>
      )}
      {onDelete && (
        <button 
          onClick={() => handleDelete(model)}
          aria-label="Delete row"
          data-testid={`action-delete-btn-${model.id}`}
          className={`action-button delete ${model.status === 'deleted' ? 'disabled' : ''}`}
          disabled={model.status === 'deleted'}
          title={model.status === 'deleted' ? 'Deleted' : 'Delete'}
        >
          <span className="icon">🗑️</span>
        </button>
      )}
      {onUndo && (
        <button 
          onClick={() => onUndo(model)}
          aria-label="Undo row"
          data-testid={`action-undo-btn-${model.id}`}
          className="action-button undo"
          disabled={!model.canUndo}
          title="Undo"
        >
          <span className="icon">↩️</span>
        </button>
      )}
      {onRedo && model.canRedo !== undefined && (
        <button 
          onClick={() => onRedo(model)}
          aria-label="Redo row"
          data-testid={`action-redo-btn-${model.id}`}
          className="action-button redo"
          disabled={!model.canRedo}
          title="Redo"
        >
          <span className="icon">↪️</span>
        </button>
      )}
    </Container>
  );
}
