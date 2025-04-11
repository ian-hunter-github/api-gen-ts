import React from 'react';
import { AttributeModel } from '../../types/entities/attributes';
import './AttributeRowView.css';

interface AttributeRowViewProps {
  model: AttributeModel;
  onEdit: (model: AttributeModel) => void;
  onDelete: (model: AttributeModel) => void;
  onUndo: (model: AttributeModel) => void;
  onRedo: (model: AttributeModel) => void;
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

  const getRowClass = () => {
    const classes = [];
    if (deleted) classes.push('deleted');
    if (changed) classes.push('changed');
    return classes.join(' ');
  };

  const canUndo = model.canUndo;
  const canRedo = model.canRedo;

  return (
    <div className={`attribute-row ${getRowClass()}`}>
      <div 
        className="attribute-cell" 
        data-testid={`attribute-name-${model.current?.name}`}
        style={deleted ? { textDecoration: 'line-through' } : undefined}
      >
        {renderText(model.current?.name)}
      </div>
      <div className="attribute-cell">{renderText(model.current?.type)}</div>
      <div className="attribute-cell">{renderText(model.current?.required)}</div>
      <div className="attribute-cell actions">
        <div className="action-buttons">
          <button
            onClick={() => onEdit(model)}
            disabled={deleted}
            aria-label={`Edit ${model.current.name}`}
          >
            <span className="material-icons">edit</span>
          </button>
          <button
            onClick={() => onDelete(model)}
            disabled={deleted}
            aria-label={`Delete ${model.current.name}`}
          >
            <span className="material-icons">delete</span>
          </button>
          <button
            onClick={() => onUndo(model)}
            disabled={!canUndo}
            aria-label={`Undo delete ${model.current.name}`}
          >
            <span className="material-icons">undo</span>
          </button>
          <button
            onClick={() => onRedo(model)}
            disabled={!canRedo}
            aria-label={`Redo changes to ${model.current.name}`}
          >
            <span className="material-icons">redo</span>
          </button>
 
        </div>
      </div>
    </div>
  );
};
