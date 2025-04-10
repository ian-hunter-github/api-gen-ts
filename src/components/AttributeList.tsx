import React, { useState, useMemo } from 'react';
import './AttributeList.css';
import { EntityAttribute } from '../types/entities/attributes';
import { AttributeDialog } from './AttributeDialog';

interface AttributeListProps {
  attributes: EntityAttribute[];
  onAdd: () => void;
  onEdit: (attribute: EntityAttribute) => void;
  onDelete: (attributeName: string) => void;
  onUndoDelete: (attributeName: string) => void;
  changedAttributes: Set<string>;
  deletedAttributes: Set<string>;
}

export const AttributeList: React.FC<AttributeListProps> = ({
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
  const [currentAttribute, setCurrentAttribute] = useState<EntityAttribute | null>(null);

  const existingNames = useMemo(() => 
    attributes.map(attr => attr.name), 
    [attributes]
  );

  const handleEdit = (attribute: EntityAttribute) => {
    setCurrentAttribute(attribute);
    setIsDialogOpen(true);
  };

  const handleSave = (attribute: EntityAttribute) => {
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
    const comparison = a.name.localeCompare(b.name);
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  // Put changed attributes first
  const prioritizedAttributes = [...processedAttributes].sort((a, b) => {
    const aChanged = changedAttributes.has(a.name);
    const bChanged = changedAttributes.has(b.name);
    if (aChanged && !bChanged) return -1;
    if (!aChanged && bChanged) return 1;
    return 0;
  });

  const renderText = (text: string | boolean | undefined) => {
    return typeof text === 'boolean' ? (text ? 'Yes' : 'No') : text || '';
  };

  return (
    <div className="attribute-list">
      {currentAttribute && (
        <AttributeDialog
          attribute={currentAttribute}
          existingNames={existingNames}
          onSave={handleSave}
          onCancel={handleCancel}
          open={isDialogOpen}
        />
      )}
      <div className="attribute-list-header">
        <h3>Attributes</h3>
        <button className="add-button" onClick={onAdd}>
          <span className="material-icons">add</span>
        </button>
      </div>

      <div className="attribute-list-container">
        <div className="attribute-list-header-row">
          <div className="attribute-list-header-cell">
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
          <div className="attribute-list-header-cell">Type</div>
          <div className="attribute-list-header-cell">Required</div>
          <div className="attribute-list-header-cell">Actions</div>
        </div>
        <div className="attribute-list-body">
          {prioritizedAttributes.map((attribute) => {
              const isDeleted = deletedAttributes.has(attribute.name);
              const rowClass = isDeleted
                ? 'deleted'
                : changedAttributes.has(attribute.name)
                ? 'changed'
                : '';

              return (
                <div key={attribute.name} className={`attribute-list-row ${rowClass}`}>
                  <div className="attribute-list-cell" data-testid="attribute-name">
                    {renderText(attribute.name)}
                  </div>
                  <div className="attribute-list-cell">{renderText(attribute.type)}</div>
                  <div className="attribute-list-cell">{renderText(attribute.required)}</div>
                  <div className="attribute-list-cell actions">
                    {isDeleted ? (
                      <button
                        className="undo-button"
                        onClick={() => onUndoDelete(attribute.name)}
                        aria-label={`Undo delete ${attribute.name}`}
                      >
                        <span className="material-icons">undo</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(attribute)}
                          disabled={isDeleted}
                          aria-label={`Edit ${attribute.name}`}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          onClick={() => onDelete(attribute.name)}
                          aria-label={`Delete ${attribute.name}`}
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
