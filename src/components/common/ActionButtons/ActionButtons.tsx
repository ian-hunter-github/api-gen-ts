import React from 'react';
import { Model } from '../../../utils/Model';
import './ActionButtons.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ActionButtonsProps<T = any> {
  model: Model<T>;
  onEdit?: (model: Model<T>) => void;
  onDelete?: (model: Model<T>) => void;
  onUndo?: (model: Model<T>) => void;
  onRedo?: (model: Model<T>) => void;
  containerComponent?: React.ElementType;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ActionButtons<T = any>({
  model,
  onEdit,
  onDelete,
  onUndo,
  onRedo,
  containerComponent: Container = 'div',
}: ActionButtonsProps<T>) {
  const handleDelete = (model: Model<T>) => {
    console.debug('ActionButtons: Attempting to delete model', model.id, 'with status:', model.status);
    console.debug('Model before delete:', JSON.stringify(model, null, 2));
    model.delete();
    console.debug('Model after delete:', JSON.stringify(model, null, 2));
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
        >
          Edit
        </button>
      )}
      {onDelete && (
        <button 
          onClick={() => handleDelete(model)}
          aria-label="Delete row"
          data-testid={`action-delete-btn-${model.id}`}
          className={`action-button delete ${model.status === 'deleted' ? 'disabled' : ''}`}
          disabled={model.status === 'deleted'}
        >
          {model.status === 'deleted' ? 'Deleted' : 'Delete'}
        </button>
      )}
      {onUndo && (
        <button 
          onClick={() => onUndo(model)}
          aria-label="Undo row"
          data-testid={`action-undo-btn-${model.id}`}
          className="action-button undo"
          disabled={!model.canUndo}
        >
          Undo
        </button>
      )}
      {onRedo && model.canRedo !== undefined && (
        <button 
          onClick={() => onRedo(model)}
          aria-label="Redo row"
          data-testid={`action-redo-btn-${model.id}`}
          className="action-button redo"
          disabled={!model.canRedo}
        >
          Redo
        </button>
      )}
    </Container>
  );
}
