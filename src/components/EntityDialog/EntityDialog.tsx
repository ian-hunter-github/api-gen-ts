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

  const attributeTableRef = React.useRef<{ getAttributes: () => AttributeModel[] }>(null);

  const handleAddAttribute = (): void => {};
  const handleEditAttribute = (): void => {};
  const handleDeleteAttribute = (): void => {};
  const handleUndoDelete = (): void => {};

  const handleSave = (): void => {
    if (!attributeTableRef.current) return;
    
    const attributeModels = attributeTableRef.current.getAttributes();
    const finalAttributes = attributeModels.map(model => model.current);
    
    onSave({
      ...currentEntity,
      attributes: finalAttributes
    });
  };

  const handleCancel = (): void => {
    setCurrentEntity({ ...entity });
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
            ref={attributeTableRef}
            initialAttributes={attributeModels}
            onAdd={handleAddAttribute}
            onEdit={handleEditAttribute}
            onDelete={handleDeleteAttribute}
            onUndoDelete={handleUndoDelete}
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
