import React, { useState, useMemo } from 'react';
import './AttributeTable.css';
import type { AttributeModel } from '../types/entities/attributes';
import { AttributeDialog } from './AttributeDialog';

interface AttributeTableProps {
  attributes: AttributeModel[];
  onAdd: () => void;
  onEdit: (attribute: AttributeModel) => void;
  onDelete: (attributeName: string) => void;
  onUndoDelete: (attributeName: string) => void;
  changedAttributes: Set<string>;
  deletedAttributes: Set<string>;
}

export const AttributeTable: React.FC<AttributeTableProps> = ({
  attributes,
  onAdd,
  onEdit,
  onDelete,
  onUndoDelete,
  changedAttributes,
  deletedAttributes,
}) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAttribute, setCurrentAttribute] = useState<AttributeModel | null>(null);

  const existingNames = useMemo(() => 
    attributes.map(attr => attr.current.name), 
    [attributes]
  );

  const handleEdit = (attribute: AttributeModel) => {
    setCurrentAttribute(attribute);
    setIsDialogOpen(true);
  };

  const handleSave = (attribute: AttributeModel) => {
    onEdit(attribute);
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  const handleSort = () => {
    if (sortDirection === null) {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortDirection('asc');
    } else {
      setSortDirection(null);
    }
  };

  const processedAttributes = [...attributes].sort((a, b) => {
    const comparison = a.current.name.localeCompare(b.current.name);
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  // Put changed attributes first
  const prioritizedAttributes = [...processedAttributes].sort((a, b) => {
    const aChanged = changedAttributes.has(a.current.name);
    const bChanged = changedAttributes.has(b.current.name);
    if (aChanged && !bChanged) return -1;
    if (!aChanged && bChanged) return 1;
    return 0;
  });

  const renderText = (text: string | boolean | undefined) => {
    return typeof text === 'boolean' ? (text ? 'Yes' : 'No') : text || '';
  };

  return (
    <div className="attribute-table">
      {currentAttribute && (
        <AttributeDialog
          attribute={currentAttribute}
          existingNames={existingNames}
          onSave={handleSave}
          onCancel={handleCancel}
          open={isDialogOpen}
        />
      )}
      <div className="attribute-table-header">
        <h3>Attributes</h3>
        <button className="add-button" onClick={onAdd}>
          <span className="material-icons">add</span>
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="table-header-cell">
            Name
            <button
              className="sort-button"
              onClick={handleSort}
              aria-label={`Sort ${sortDirection === null || sortDirection === 'asc' ? 'descending' : 'ascending'}`}
            >
              <span className="material-icons">
                {sortDirection === 'asc' ? 'arrow_downward' : 
                 sortDirection === 'desc' ? 'arrow_upward' : 'sort'}
              </span>
            </button>
          </div>
          <div className="table-header-cell">Type</div>
          <div className="table-header-cell">Required</div>
          <div className="table-header-cell">Actions</div>
        </div>
        <div className="table-body">
          {prioritizedAttributes.map((attribute) => {
              const isDeleted = deletedAttributes.has(attribute.current.name);
              const rowClass = isDeleted
                ? 'deleted'
                : changedAttributes.has(attribute.current.name)
                ? 'changed'
                : '';

              return (
                <div key={attribute.current.name} className={`table-row ${rowClass}`}>
                  <div className="table-cell" data-testid={`attribute-name-${attribute.current.name}`}>
                    {renderText(attribute.current.name)}
                  </div>
                  <div className="table-cell">{renderText(attribute.current.type)}</div>
                  <div className="table-cell">{renderText(attribute.current.required)}</div>
                  <div className="table-cell actions">
                    {isDeleted ? (
                      <button
                        className="undo-button"
                        onClick={() => onUndoDelete(attribute.current.name)}
                        aria-label={`Undo delete ${attribute.current.name}`}
                      >
                        <span className="material-icons">undo</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(attribute)}
                          disabled={isDeleted}
                          aria-label={`Edit ${attribute.current.name}`}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          onClick={() => onDelete(attribute.current.name)}
                          aria-label={`Delete ${attribute.current.name}`}
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
