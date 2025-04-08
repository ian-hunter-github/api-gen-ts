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
  const [entity, setEntity] = useState<ApiEntity>(initialEntity);
  const [nameError, setNameError] = useState<string>('');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { getApi } = useApiConfigStore();
  const currentApi = getApi('current');
  const entities = currentApi?.entities || [];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEntity(prev => ({ ...prev, [name]: value }));
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
    onSave(entity);
    onClose?.();
  };

  const handleAddAttribute = (attribute: EntityAttribute) => {
    setEntity(prev => ({
      ...prev,
      attributes: [...prev.attributes, attribute]
    }));
  };

  const handleEditAttribute = (attribute: EntityAttribute) => {
    setEntity(prev => ({
      ...prev,
      attributes: prev.attributes.map(a => 
        a.name === attribute.name ? attribute : a
      )
    }));
  };

  const handleDeleteAttribute = (attributeName: string) => {
    setEntity(prev => ({
      ...prev,
      attributes: prev.attributes.filter(a => a.name !== attributeName)
    }));
  };

  const isEditMode = !!initialEntity.name;
  const isValid = entity.name.trim() !== '' && !nameError;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
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
            className={nameError ? 'error-input' : ''}
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
          />
        </div>

        <AttributeList 
          attributes={entity.attributes}
          onAdd={handleAddAttribute}
          onEdit={handleEditAttribute}
          onDelete={handleDeleteAttribute}
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
