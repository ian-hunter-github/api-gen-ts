import React, { useState } from 'react';
import { Model } from '../../../utils/Model';
import { AttributeDialog } from '../../AttributeDialog/AttributeDialog';
import type { EntityAttribute } from '../../../types/entities/attributes';
import './Table.css';

export interface TableProps<T extends Record<string, unknown>> {
  showAttributeDialog?: boolean;
  models: Array<Model<T>>;
  onEdit?: (model: Model<T>) => void;
  onDelete?: (model: Model<T>) => void;
  onUndo?: (model: Model<T>) => void;
  onRedo?: (model: Model<T>) => void;
  renderCellContent?: (value: T | null) => React.ReactNode[];
  existingNames?: string[];
}

export function Table<T extends Record<string, unknown>>({
  models,
  onEdit,
  onDelete,
  onUndo,
  onRedo,
  renderCellContent,
  existingNames = [],
  showAttributeDialog = false,
}: TableProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (model: Model<T>) => {
    setIsDialogOpen(false);
    onEdit?.(model);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  const handleDelete = (model: Model<T>) => {
    model.delete();
    onDelete?.(model);
  };

  if (models.length === 0) {
    return <div className="table-empty">No data available</div>;
  }

  // Get headers from all models' combined keys
  const headers = Array.from(
    new Set(
      models.flatMap(model => 
        Object.keys(model.current || {})
          .filter(key => key !== 'id')
      )
    )
  ).map(key => key.charAt(0).toUpperCase() + key.slice(1));


  return (
    <div 
      className="table-container" 
      role="table" 
      aria-label="Data table" 
      data-testid="attribute-table"
      key={models.length} // Force re-render when models change
    >
      <div className="table-header" role="rowgroup">
        {headers.map((header) => (
          <div className="table-header-cell" key={header} role="columnheader">
            {header}
          </div>
        ))}
        {(onEdit || onDelete || onUndo || onRedo) && (
          <div className="table-header-cell">Actions</div>
        )}
      </div>
      <div className="table-body" role="rowgroup">
        {models.map((model) => {
          const toDisplay = (model.current === null) ? model.previous : model.current;
          if (!toDisplay) {
            return null;
          }
          
          const rowClass = [
            'table-row',
            model.status === 'modified' ? 'changed' : '',
            model.status === 'deleted' ? 'deleted' : '',
          ].filter(Boolean).join(' ');

          return (
            <div 
              key={toDisplay.id as string} 
              className={rowClass}
              role="row"
              data-testid="attribute-row"
            >
              {Object.entries(toDisplay)
                .filter(([key]) => key !== 'id')
                .filter(([, value]) => 
                  value !== undefined && 
                  value !== null &&
                  (typeof value === 'string' || 
                   typeof value === 'number' || 
                   typeof value === 'boolean')
                )
                .map(([key, value]) => {
                  const cellContent = renderCellContent 
                    ? renderCellContent(toDisplay)[0] 
                    : String(value);
                  return (
                    <div key={key} className="table-cell" role="cell">
                      {cellContent}
                    </div>
                  );
                })}
              <div className="actions">
                {onEdit && (
                  <button 
                    onClick={() => onEdit(model)}
                    aria-label="Edit row"
                    data-testid="attribute-edit-btn"
                    disabled={model.status === 'deleted'}
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button 
                    onClick={() => handleDelete(model)}
                    aria-label="Delete row"
                    data-testid="attribute-delete-btn"
                    disabled={model.status === 'deleted'}
                  >
                    Delete
                  </button>
                )}
                {onUndo && (
                  <button 
                    className="undo-button"
                    onClick={() => onUndo(model)}
                    aria-label="Undo row"
                    data-testid="attribute-undo-btn"
                    disabled={!model.canUndo}
                  >
                    Undo
                  </button>
                )}
                {onRedo && (
                  <button 
                    className="redo-button"
                    onClick={() => onRedo(model)}
                    aria-label="Redo row"
                    data-testid="attribute-redo-btn"
                    disabled={!model.canRedo || model.status === 'deleted'}
                  >
                    Redo
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {isDialogOpen && showAttributeDialog && (
        <AttributeDialog
          attribute={{} as Model<EntityAttribute>}
          existingNames={existingNames}
          onSave={handleSave as unknown as (model: Model<EntityAttribute>) => void}
          onCancel={handleCancel}
          open={isDialogOpen}
        />
      )}
    </>
  );
}
