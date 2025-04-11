import React, { useState, useMemo } from 'react';
import type { ApiEntity } from '../../types/entities/entity';
import type { EntityAttribute } from '../../types/entities/attributes';
import { AttributeModel } from '../../types/entities/attributes';
import { AttributeTable } from '../AttributeTable/AttributeTable';
import './EntityDialog.css';

interface EntityDialogProps {
  entity: ApiEntity;
  open: boolean;
  onSave: (entity: ApiEntity) => void;
  onCancel: () => void;
  onClose: () => void;
}

export const EntityDialog: React.FC<EntityDialogProps> = ({ 
  entity, 
  open,
  onSave, 
  onCancel,
  onClose
}) => {
  const [currentEntity, setCurrentEntity] = useState<ApiEntity>({ ...entity });
  const attributeModels = useMemo(() => 
    currentEntity.attributes.map((attr: EntityAttribute) => new AttributeModel(attr)),
    [currentEntity.attributes]
  );
  const [changedAttributes, setChangedAttributes] = useState<Set<string>>(new Set());
  const [deletedAttributes, setDeletedAttributes] = useState<Set<string>>(new Set());

  const handleAddAttribute = (): void => {
    const newAttribute: EntityAttribute = {
      name: `new_attribute_${Date.now()}`,
      type: 'string',
      required: false
    };
    setCurrentEntity((prev: ApiEntity) => ({
      ...prev,
      attributes: [...prev.attributes, newAttribute]
    }));
    setChangedAttributes((prev: Set<string>) => new Set(prev).add(newAttribute.name));
  };

  const handleEditAttribute = (attribute: EntityAttribute): void => {
    setCurrentEntity((prev: ApiEntity) => ({
      ...prev,
      attributes: prev.attributes.map((a: EntityAttribute) => 
        a.name === attribute.name ? attribute : a
      )
    }));
    setChangedAttributes((prev: Set<string>) => new Set(prev).add(attribute.name));
  };

  const handleDeleteAttribute = (attributeName: string): void => {
    setDeletedAttributes((prev: Set<string>) => new Set(prev).add(attributeName));
  };

  const handleUndoDelete = (attributeName: string): void => {
    setDeletedAttributes((prev: Set<string>) => {
      const newSet = new Set(prev);
      newSet.delete(attributeName);
      return newSet;
    });
  };

  const handleSave = (): void => {
    const finalAttributes = currentEntity.attributes
      .filter((attr: EntityAttribute) => !deletedAttributes.has(attr.name))
      .map((attr: EntityAttribute) => {
        const modified = changedAttributes.has(attr.name);
        return modified ? { ...attr, modified: true } : attr;
      });
    
    onSave({
      ...currentEntity,
      attributes: finalAttributes
    });
  };

  const handleCancel = (): void => {
    setCurrentEntity({ ...entity });
    setChangedAttributes(new Set());
    setDeletedAttributes(new Set());
    onCancel();
  };

  if (!open) return null;

  return (
    <div className="entity-dialog-overlay" onClick={onClose}>
      <div className="entity-dialog" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>{entity.name ? `Edit ${entity.name}` : 'Create New Entity'}</h2>
            </div>

        <div className="dialog-content">
          <div className="entity-form">
            <div className="form-group">
              <label htmlFor="entity-name">Name</label>
              <input
                id="entity-name"
                type="text"
                value={currentEntity.name}
                onChange={(e) => setCurrentEntity(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="entity-description">Description</label>
              <textarea
                id="entity-description"
                value={currentEntity.description || ''}
                onChange={(e) => setCurrentEntity(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
              />
            </div>
          </div>

          <AttributeTable
            attributes={attributeModels}
            onAdd={handleAddAttribute}
            onEdit={(attr) => handleEditAttribute(attr.current)}
            onDelete={handleDeleteAttribute}
            onUndoDelete={handleUndoDelete}
            changedAttributes={changedAttributes}
            deletedAttributes={deletedAttributes}
          />
        </div>

        <div className="dialog-footer">
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleSave}>Update</button>
        </div>
      </div>
    </div>
  );
};
