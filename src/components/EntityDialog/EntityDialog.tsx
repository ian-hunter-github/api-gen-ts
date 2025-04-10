import React, { useState, useMemo, useCallback } from 'react';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';
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
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  console.log('EntityDialog mounted with initial changes:', hasChanges);

  const handleConfirmAction = useCallback((action: () => void) => {
    if (hasChanges) {
      setConfirmAction(() => action);
      setShowConfirmDialog(true);
    } else {
      action();
    }
  }, [hasChanges]);

  const handleConfirm = useCallback(() => {
    setShowConfirmDialog(false);
    confirmAction?.();
  }, [confirmAction]);

  const handleCancelConfirm = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  const handleClose = (): void => {
    handleConfirmAction(onClose);
  };

  const checkForChanges = (newEntity: ApiEntity): void => {
    console.log('Checking for changes ...');

    // Check basic fields
    const basicFieldsChanged = newEntity.name !== entity.name || 
                             newEntity.description !== entity.description;

    // Check attributes if ref is available
    let attributesChanged = false;
    if (attributeTableRef.current) {
      const currentAttributes = attributeTableRef.current.getAttributes();
      // Check for any modified, new, or deleted attributes
      attributesChanged = currentAttributes.some(attr => {
        const isChanged = attr.status !== 'pristine';
        console.log(`Attribute ${attr.current?.name || attr.previous?.name}: status=${attr.status}, changed=${isChanged}`);
        return isChanged;
      });

      // Also check if any original attributes are now missing (fully deleted)
      const currentNames = new Set(currentAttributes
        .filter(a => a.status !== 'deleted')
        .map(a => a.current?.name || a.previous?.name));
      
      const hasDeletedAttributes = entity.attributes.some(origAttr => 
        !currentNames.has(origAttr.name)
      );
      
      if (hasDeletedAttributes) {
        console.log('Detected fully deleted attributes');
        attributesChanged = true;
      }
    }

    const changed = basicFieldsChanged || attributesChanged;
    console.log('Change detected - basic:', basicFieldsChanged, 'attributes:', attributesChanged);
    setHasChanges(changed);
  };

  const attributeModels = useMemo(() => 
    currentEntity.attributes.map((attr: EntityAttribute) => new AttributeModel(attr)),
    [currentEntity.attributes]
  );

  const attributeTableRef = React.useRef<{ getAttributes: () => AttributeModel[] }>(null);

  const handleAddAttribute = (): void => {
    // Implementation needed
  };

  const handleEditAttribute = (attribute: AttributeModel): void => {
    const name = attribute.current?.name ?? 'unknown';
    console.log('Editing attribute:', name);
  };

  const handleSave = (): void => {
    if (!attributeTableRef.current) return;
    
    const attributeModels = attributeTableRef.current.getAttributes();
    const finalAttributes = attributeModels
      .filter(model => model.status !== 'deleted')
      .map(model => model.current)
      .filter((attr): attr is EntityAttribute => attr !== null);
    
    onSave({
      ...currentEntity,
      attributes: finalAttributes
    });
  };

  const handleCancel = (): void => {
    handleConfirmAction(() => {
      setCurrentEntity({ ...entity });
      onCancel();
    });
  };

  if (!open) return null;

  return (
    <>
      <div className="entity-dialog-overlay" onClick={handleClose}>
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
                  onChange={(e) => {
                    const newEntity = {
                      ...currentEntity,
                      name: e.target.value
                    };
                    setCurrentEntity(newEntity);
                    checkForChanges(newEntity);
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="entity-description">Description</label>
                <textarea
                  id="entity-description"
                  value={currentEntity.description || ''}
                  onChange={(e) => {
                    const newEntity = {
                      ...currentEntity,
                      description: e.target.value
                    };
                    setCurrentEntity(newEntity);
                    checkForChanges(newEntity);
                  }}
                />
              </div>
            </div>

            <AttributeTable
              ref={attributeTableRef}
              initialAttributes={attributeModels}
              onAdd={handleAddAttribute}
              onEdit={handleEditAttribute}
              onChange={() => checkForChanges(currentEntity)}
            />
          </div>

          <div className="dialog-footer">
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleSave}>Update</button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirmDialog}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to discard them?"
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
      />
    </>
  );
};
