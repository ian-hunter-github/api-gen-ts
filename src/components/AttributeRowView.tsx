import React from 'react';
import { AttributeModel } from '../types/entities/attributes';
import './AttributeRowView.css';

interface AttributeRowViewProps {
  model: AttributeModel;
  onEdit: (model: AttributeModel) => void;
  onDelete: (model: AttributeModel) => void;
  onUndo: (model: AttributeModel) => void;
  onRedo: (model: AttributeModel) => void;
  onRestore: (model: AttributeModel) => void;
  deleted: boolean;
  changed: boolean;
}

export const AttributeRowView: React.FC<AttributeRowViewProps> = ({
  model,
  onEdit,
  onDelete,
  onUndo,
  onRedo,
  onRestore,
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
    <table>
      <tbody>
        <tr className={`attribute-row ${getRowClass()}`}>
          <td className="attribute-cell" data-testid="attribute-name">
            {renderText(model.current?.name)}
          </td>
          <td className="attribute-cell">{renderText(model.current?.type)}</td>
          <td className="attribute-cell">{renderText(model.current?.required)}</td>
          <td className="attribute-cell actions">
            {deleted ? (
              <button
                className="undo-button"
                onClick={() => onRestore(model)}
                aria-label={`Restore ${model.current.name}`}
              >
                <span className="material-icons">undo</span>
              </button>
            ) : (
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
                  aria-label={`Delete ${model.current.name}`}
                >
                  <span className="material-icons">delete</span>
                </button>
                {canUndo && (
                  <button
                    onClick={() => onUndo(model)}
                    aria-label={`Undo changes to ${model.current.name}`}
                  >
                    <span className="material-icons">undo</span>
                  </button>
                )}
                {canRedo && (
                  <button
                    onClick={() => onRedo(model)}
                    aria-label={`Redo changes to ${model.current.name}`}
                  >
                    <span className="material-icons">redo</span>
                  </button>
                )}
              </div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
