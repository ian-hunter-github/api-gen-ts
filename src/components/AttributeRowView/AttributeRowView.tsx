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
              console.log('=== DEBUG: Before Delete ===');
              console.log('Model:', {
                name: current.name,
                status: model.status,
                canUndo: model.canUndo,
                canRedo: model.canRedo
              });
              console.log('Props:', { deleted, changed });
              onDelete(model);
              setTimeout(() => {
                console.log('=== DEBUG: After Delete ===');
                console.log('Model:', {
                  name: current.name,
                  status: model.status,
                  canUndo: model.canUndo,
                  canRedo: model.canRedo
                });
              }, 100);
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
