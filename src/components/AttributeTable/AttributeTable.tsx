import React, { useState, useMemo } from 'react';
import './AttributeTable.css';
import type { AttributeModel } from '../../types/entities/attributes';
import { AttributeDialog } from '../AttributeDialog/AttributeDialog';
import { AttributeRowView } from '../AttributeRowView/AttributeRowView';

interface AttributeTableProps {
  initialAttributes: AttributeModel[];
  onAdd: () => void;
  onEdit: (attribute: AttributeModel) => void;
  onDelete: (attributeName: string) => void;
  onUndoDelete: (attributeName: string) => void;
  changedAttributes?: Set<string>;
  deletedAttributes?: Set<string>;
}

export const AttributeTable = React.forwardRef<{
  getAttributes: () => AttributeModel[];
}, AttributeTableProps>(({
  initialAttributes,
  onAdd,
  onEdit,
  onDelete,
  onUndoDelete,
  changedAttributes = new Set(),
  deletedAttributes = new Set(),
}, ref) => {
  const [attributes, setAttributes] = useState<AttributeModel[]>(initialAttributes);
  const [currentAttribute, setCurrentAttribute] = useState<AttributeModel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [localChangedAttributes, setLocalChangedAttributes] = useState<Set<string>>(new Set());

  const handleEdit = (attribute: AttributeModel) => {
    setCurrentAttribute(attribute);
    setIsDialogOpen(true);
  };

  const handleDelete = (attributeName: string) => {
    onDelete(attributeName);
  };

  React.useImperativeHandle(ref, () => ({
    getAttributes: () => {
      return attributes
        .filter(attr => !deletedAttributes.has(attr.current.name))
        .map(attr => {
          const modified = changedAttributes.has(attr.current.name);
          if (modified && attr.status !== 'modified') {
            attr.update({}); // Empty update to trigger modified status
          }
          return attr;
        });
    }
  }), [attributes, changedAttributes, deletedAttributes]);

  const existingNames = useMemo(() => 
    attributes.map(attr => attr.current.name), 
    [attributes]
  );

  const handleSave = (attribute: AttributeModel) => {
    setAttributes(prev => 
      prev.map(a => 
        a.current.name === attribute.current.name ? attribute : a
      )
    );
    setLocalChangedAttributes(prev => new Set(prev).add(attribute.current.name));
    setIsDialogOpen(false);
    onEdit(attribute);
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

  const prioritizedAttributes = [...processedAttributes].sort((a, b) => {
    const aChanged = localChangedAttributes.has(a.current.name) || changedAttributes.has(a.current.name);
    const bChanged = localChangedAttributes.has(b.current.name) || changedAttributes.has(b.current.name);
    if (aChanged && !bChanged) return -1;
    if (!aChanged && bChanged) return 1;
    return 0;
  });

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
          {prioritizedAttributes.map((attribute) => (
            <AttributeRowView
              key={attribute.current.name}
              model={attribute}
              onEdit={() => handleEdit(attribute)}
              onDelete={() => handleDelete(attribute.current.name)}
              onUndo={() => {
                deletedAttributes.delete(attribute.current.name);
                onUndoDelete(attribute.current.name);
              }}
              onRedo={() => {}}
              deleted={deletedAttributes.has(attribute.current.name)}
              changed={changedAttributes.has(attribute.current.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
