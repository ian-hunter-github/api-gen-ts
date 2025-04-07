import React, { useState, useEffect } from 'react';
import type { ApiEntity } from '../types/entities/entity';
import type { EntityAttribute } from '../types/entities/attributes';
import { AttributeList } from './AttributeList';
import { useApiConfigStore } from '../stores/apiConfigStore';
import './EntityDialog.css';

interface EntityDialogProps {
  entity: ApiEntity;
  onSave: (entity: ApiEntity) => void;
  onCancel: () => void;
}

export const EntityDialog: React.FC<EntityDialogProps> = ({ 
  entity: initialEntity,
  onSave,
  onCancel 
}) => {
  const [entity, setEntity] = useState<ApiEntity>(initialEntity);
  const [nameError, setNameError] = useState<string>('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(entity);
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
    <div className="entity-dialog">
      <div className="dialog-header">
        <h2>{isEditMode ? `Edit ${initialEntity.name}` : 'Create New Entity'}</h2>
        <div className="dialog-header-actions">
          <button type="button" className="secondary-button">
            Relationships
          </button>
          <button type="button" className="secondary-button">
            Endpoints
          </button>
        </div>
      </div>

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
    </div>
  );
};
