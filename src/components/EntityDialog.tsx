import React, { useState } from 'react';
import type { ApiEntity } from '../types/entities/entity';
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEntity(prev => ({ ...prev, [name]: value }));
  };

  const handleRemoveAttribute = (index: number) => {
    setEntity(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(entity);
  };

  const isEditMode = !!initialEntity.name;
  const isValid = entity.name.trim() !== '';

  return (
    <div className="entity-dialog">
      <h2>{isEditMode ? `Edit ${initialEntity.name}` : 'Create New Entity'}</h2>
      
      <div className="dialog-actions">
        <button 
          type="button" 
          className="secondary-button"
          onClick={() => console.log('Relationships clicked')}
        >
          Relationships...
        </button>
        <button 
          type="button" 
          className="secondary-button"
          onClick={() => console.log('Endpoints clicked')}
        >
          Endpoints...
        </button>
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
          />
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

        <div className="attributes-section">
          <div className="attributes-header">
            <h3>Attributes</h3>
            <button
              type="button"
              className="add-button"
              onClick={() => {}}
            >
              +
            </button>
          </div>
          
          <div className="attributes-grid">
            {entity.attributes.map((attr, index) => (
              <div key={index} className="attribute-row">
                <span>{attr.name}</span>
                <span>{attr.type}</span>
                <span>{attr.required ? 'Yes' : 'No'}</span>
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => console.log('Edit', index)}
                >
                  ✏️
                </button>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleRemoveAttribute(index)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

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
        </div>
      </form>
    </div>
  );
};
