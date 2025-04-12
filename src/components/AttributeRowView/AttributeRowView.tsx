import React from 'react';
import type { EntityAttribute } from '../../types/entities/attributes';
import { Model } from '../../utils/Model';
import './AttributeRowView.css';

interface AttributeRowViewProps {
  model: Model<EntityAttribute>;
  onEdit: (model: Model<EntityAttribute>) => void;
  onDelete: (model: Model<EntityAttribute>) => void;
  onUndo: (model: Model<EntityAttribute>) => void;
  onRedo: (model: Model<EntityAttribute>) => void;
  deleted: boolean;
  changed: boolean;
}

export const AttributeRowView: React.FC<AttributeRowViewProps> = ({
  model,
  onEdit,
  onDelete,
  onUndo,
  onRedo,
  deleted,
  changed,
}) => {
  const renderText = (text: string | boolean | undefined) => {
    if (text === undefined || text === null) return '';
    return typeof text === 'boolean' ? (text ? 'Yes' : 'No') : text;
  };

  const isDeleted = model.status === 'deleted' || deleted;
  const isModified = model.status === 'modified' || changed;
  
  const getRowClass = () => {
    const classes = [];
    if (isDeleted) classes.push('deleted');
    if (isModified) classes.push('modified');
    return classes.join(' ');
  };

  const canUndo = model.canUndo;
  const canRedo = model.canRedo;
  const current = model.current ?? model.previous ?? {
    name: '',
    type: 'string', 
    required: false
  };

  return (
    <div className={`attribute-row ${getRowClass()}`}>
      <div 
        className="attribute-cell" 
        data-testid={`attribute-name-${current.name}`}
      >
        {renderText(current.name)}
      </div>
      <div className="attribute-cell">{renderText(current.type)}</div>
      <div className="attribute-cell">{renderText(current.required)}</div>
      <div className="attribute-cell actions">
        <div className="action-buttons">
          <button
            onClick={() => onEdit(model)}
            disabled={isDeleted}
            aria-label={`Edit ${current.name}`}
          >
            <span className="material-icons">edit</span>
          </button>
          <button
            onClick={() => {
              onDelete(model);
            }}
            disabled={deleted}
            aria-label={`Delete ${current.name}`}
          >
            <span className="material-icons">delete</span>
          </button>
          <button
            onClick={() => onUndo(model)}
            disabled={!canUndo}
            aria-label={`Undo delete ${current.name}`}
          >
            <span className="material-icons">undo</span>
          </button>
          <button
            onClick={() => onRedo(model)}
            disabled={!canRedo}
            aria-label={`Redo changes to ${current.name}`}
          >
            <span className="material-icons">redo</span>
          </button>
 
        </div>
      </div>
    </div>
  );
};
