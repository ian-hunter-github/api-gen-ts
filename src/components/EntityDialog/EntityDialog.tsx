import React, { useState, useCallback } from "react";
import { ConfirmDialog } from "../ConfirmDialog/ConfirmDialog";
import { AttributeDialog } from "../AttributeDialog/AttributeDialog";
import type { ApiEntity } from "../../types/entities/entity";
import type { EntityAttribute } from "../../types/entities/attributes";
import { Model } from "../../utils/Model";
import { Table } from "../common/Table/Table";
import "./EntityDialog.css";

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
  onClose,
}) => {
  const [currentEntity, setCurrentEntity] = useState<ApiEntity>({ ...entity });

  React.useEffect(() => {
    setCurrentEntity({ ...entity });
  }, [entity]);
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  const handleConfirmAction = useCallback(
    (action: () => void) => {
      if (hasChanges) {
        setConfirmAction(() => action);
        setShowConfirmDialog(true);
      } else {
        action();
      }
    },
    [hasChanges]
  );

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

    // Check basic fields
    const basicFieldsChanged =
      newEntity.name !== entity.name ||
      newEntity.description !== entity.description;

    // Check for any modified, new, or deleted attributes
    const attributesChanged = attributeModels.some((model: Model<EntityAttribute>) => {
      return model.status !== "pristine";
    });

    // Check if any original attributes are now missing (fully deleted)
    const currentNames = new Set(
      attributeModels
        .filter((model: Model<EntityAttribute>) => model.status !== "deleted")
        .map((model) => model.current?.name || model.previous?.name)
    );

    const hasDeletedAttributes = entity.attributes.some(
      (origAttr: EntityAttribute) => {
        const deleted = !currentNames.has(origAttr.name);
        return deleted;
      }
    );

    setHasChanges(basicFieldsChanged || attributesChanged || hasDeletedAttributes);

  };

  const [attributeModels, setAttributeModels] = useState<Model<EntityAttribute>[]>(
    currentEntity.attributes.map((attr: EntityAttribute) => {
      return new Model(attr);
    })
  );


  const [editingAttribute, setEditingAttribute] = useState<Model<EntityAttribute> | null>(null);
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);

  const handleEditAttribute = (attribute: Model<EntityAttribute>): void => {
    setEditingAttribute(attribute);
    // Use setTimeout to ensure state is updated before opening dialog
    setTimeout(() => {
      setIsAttributeDialogOpen(true);
    }, 0);
  };

  const handleSaveAttribute = (attribute: Model<EntityAttribute>): void => {
    setIsAttributeDialogOpen(false);
    setEditingAttribute(null);
    // Find and update the model in attributeModels
    const updatedModels = attributeModels.map(model => {
      if (model === editingAttribute) {
        return attribute;
      }
      return model;
    });
    setAttributeModels(updatedModels);
    checkForChanges(currentEntity);
  };

  const handleCancelAttribute = (): void => {
    setIsAttributeDialogOpen(false);
    setEditingAttribute(null);
  };

  const handleSave = (): void => {
    let finalAttributes = currentEntity.attributes;

    finalAttributes = attributeModels
      .filter((model) => model.status !== "deleted")
      .map((model) => model.current)
      .filter((attr): attr is EntityAttribute => attr !== null);

    onSave({
      ...currentEntity,
      attributes: finalAttributes,
    });
  };

  const handleCancel = (): void => {
    setCurrentEntity({ ...entity });
    onCancel();
  };

  if (!open) return null;

  return (
    <>
      <div className="entity-dialog-overlay" onClick={handleClose}>
        <div className="entity-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="dialog-header">
            <h2>{entity.name ? `Edit ${entity.name}` : "Create New Entity"}</h2>
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
                      name: e.target.value,
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
                  value={currentEntity.description || ""}
                  onChange={(e) => {
                    const newEntity = {
                      ...currentEntity,
                      description: e.target.value,
                    };
                    setCurrentEntity(newEntity);
                    checkForChanges(newEntity);
                  }}
                />
              </div>
            </div>

            <Table<EntityAttribute>
              models={attributeModels}
              onEdit={handleEditAttribute}
              onDelete={(model) => {
                model.delete();
                setAttributeModels([...attributeModels]);
                checkForChanges(currentEntity);
              }}
              onUndo={(model) => {
                model.undo();
                setAttributeModels([...attributeModels]);
                checkForChanges(currentEntity);
              }}
              onRedo={(model) => {
                model.redo();
                setAttributeModels([...attributeModels]);
                checkForChanges(currentEntity);
              }}
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

      {isAttributeDialogOpen && editingAttribute && (
        <AttributeDialog
          attribute={editingAttribute}
          existingNames={attributeModels
            .filter(model => model !== editingAttribute)
            .map(model => model.current?.name || "")
            .filter(Boolean)}
          onSave={handleSaveAttribute}
          onCancel={handleCancelAttribute}
          open={isAttributeDialogOpen}
        />
      )}
    </>
  );
};
