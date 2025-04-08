import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import type { ApiEntity } from '../types/entities/entity';
import type { EntityAttribute } from '../types/entities/attributes';
import { AttributeList } from './AttributeList';
import { useApiConfigStore } from '../stores/apiConfigStore';
import './EntityDialog.css';

interface EntityDialogProps {
  entity: ApiEntity;
  onSave: (entity: ApiEntity) => void;
  onCancel: () => void;
  open: boolean;
  onClose?: () => void;
}

export const EntityDialog: React.FC<EntityDialogProps> = ({ 
  entity: initialEntity,
  onSave,
  onCancel,
  open = false,
  onClose = onCancel
}) => {
  console.log('EntityDialog rendering - open:', open);
  const [entity, setEntity] = useState<ApiEntity>(initialEntity);
  const [nameError, setNameError] = useState<string>('');
  const [changedAttributes, setChangedAttributes] = useState<Set<string>>(new Set());
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { getApi } = useApiConfigStore();
  const currentApi = getApi('current');
  const entities = currentApi?.entities || [];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEntity(prev => ({ ...prev, [name]: value }));
    setChangedFields(prev => new Set(prev).add(name));
  };

  useEffect(() => {
    if (entity.name) {
      const isUnique = !entities.some(
        (e: ApiEntity) => e.name.toLowerCase() === entity.name.toLowerCase() && 
             e.name !== initialEntity.name
      );
      setNameError(isUnique ? '' : 'Entity name must be unique');
    } else {
      setNameError('');
    }
  }, [entity.name, entities, initialEntity.name]);

  useEffect(() => {
    console.log('EntityDialog useEffect - open changed to:', open);
    if (open && nameInputRef.current) {
      // Use setTimeout to ensure focus happens after Dialog's own focus management
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('EntityDialog handleSubmit - saving entity');
    onSave(entity);
    onClose?.();
  };

  const handleAddAttribute = (attribute: EntityAttribute) => {
    console.log('EntityDialog handleAddAttribute - adding new attribute');
    const newAttribute = {
      ...attribute,
      name: `new_attribute_${Date.now()}`
    };
    setEntity(prev => ({
      ...prev,
      attributes: [...prev.attributes, newAttribute]
    }));
    setChangedAttributes(prev => new Set(prev).add(newAttribute.name));
    console.log('EntityDialog handleAddAttribute - added:', newAttribute);
  };

  const handleEditAttribute = (attribute: EntityAttribute) => {
    setEntity(prev => ({
      ...prev,
      attributes: prev.attributes.map(a => 
        a.name === attribute.name ? attribute : a
      )
    }));
    setChangedAttributes(prev => new Set(prev).add(attribute.name));
  };

  const handleDeleteAttribute = (attributeName: string) => {
    setEntity(prev => ({
      ...prev,
      attributes: prev.attributes.filter(a => a.name !== attributeName)
    }));
    setChangedAttributes(prev => {
      const newSet = new Set(prev);
      newSet.delete(attributeName);
      return newSet;
    });
  };

  const isEditMode = !!initialEntity.name;
  const isValid = entity.name.trim() !== '' && !nameError;

  return (
    <Dialog 
      open={open} 
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: 'entity-dialog'
      }}
    >
      <DialogTitle className="dialog-header">
        {isEditMode ? `Edit ${initialEntity.name}` : 'Create New Entity'}
        <div className="dialog-header-actions">
          <button type="button" className="secondary-button">
            Relationships
          </button>
          <button type="button" className="secondary-button">
            Endpoints
          </button>
        </div>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={entity.name}
            onChange={handleChange}
            required
            ref={nameInputRef}
            className={`${nameError ? 'error-input' : ''} ${changedFields.has('name') ? 'changed' : ''}`}
          />
          {nameError && <div className="error-message">{nameError}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={entity.description || ''}
            onChange={handleChange}
            className={changedFields.has('description') ? 'changed' : ''}
          />
        </div>

        <AttributeList 
          attributes={entity.attributes}
          onAdd={handleAddAttribute}
          onEdit={handleEditAttribute}
          onDelete={handleDeleteAttribute}
          changedAttributes={changedAttributes}
        />

          <div className="dialog-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={!isValid}
            >
              {isEditMode ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
