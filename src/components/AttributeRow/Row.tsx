import React from 'react';
import { Model } from '../../utils/Model';
import type { EntityAttribute } from '../../types/entities/attributes';
import './AttributeRow.css';

interface RowProps {
  model: Model<EntityAttribute>;
  onEdit: (model: Model<EntityAttribute>) => void;
  onDelete: (model: Model<EntityAttribute>) => void;
  onUndo: (model: Model<EntityAttribute>) => void;
  onRedo: (model: Model<EntityAttribute>) => void;
  changed: boolean;
  renderCellContent: (value: EntityAttribute | null) => React.ReactNode[];
}

export const Row = ({
  model,
  onEdit,
  onDelete,
  onUndo,
  onRedo,
  changed,
  renderCellContent
}: RowProps) => {
  const isModified = model.status === 'modified' || changed;
  
  const getRowClass = () => {
    const classes = [];
    if (model.status === 'deleted') classes.push('deleted');
    if (isModified) classes.push('modified');
    return classes.join(' ');
  };

  const canUndo = model.canUndo;
  const canRedo = model.canRedo;
  const current = model.current ?? model.previous;

  return (
    <div className={`attribute-row ${getRowClass()}`}>
      {renderCellContent(current ?? null).map((content, index) => (
        <div key={index} className="attribute-cell">
          {content}
        </div>
      ))}
      <div className="attribute-cell actions">
        <div className="action-buttons">
          <button
            onClick={() => onEdit(model)}
            disabled={model.status === 'deleted'}
            aria-label={`Edit ${current?.name || 'attribute'}`}
          >
            <span className="material-icons">edit</span>
          </button>
          <button
            onClick={() => onDelete(model)}
            disabled={model.status === 'deleted'}
            aria-label={`Delete ${current?.name || 'attribute'}`}
          >
            <span className="material-icons">delete</span>
          </button>
          <button
            onClick={() => onUndo(model)}
            disabled={!canUndo}
            aria-label={`Undo ${current?.name || 'attribute'}`}
          >
            <span className="material-icons">undo</span>
          </button>
          <button
            onClick={() => onRedo(model)}
            disabled={!canRedo}
            aria-label={`Redo ${current?.name || 'attribute'}`}
          >
            <span className="material-icons">redo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
