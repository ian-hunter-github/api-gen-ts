import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import type { EntityAttribute } from '../types/entities/attributes';
import './AttributeDialog.css';

interface AttributeDialogProps {
  attribute: EntityAttribute;
  existingNames: string[];
  onSave: (attribute: EntityAttribute) => void;
  onCancel: () => void;
  open: boolean;
}

export const AttributeDialog: React.FC<AttributeDialogProps> = ({ 
  attribute: initialAttribute,
  existingNames,
  onSave,
  onCancel,
  open = false
}) => {
  const [attribute, setAttribute] = useState<EntityAttribute>(initialAttribute);
  const [nameError, setNameError] = useState<string>('');
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (attribute.name) {
      const isUnique = !existingNames.includes(attribute.name) || 
                      attribute.name === initialAttribute.name;
      setNameError(isUnique ? '' : 'Attribute name must be unique within entity');
    } else {
      setNameError('');
    }
  }, [attribute.name, existingNames, initialAttribute.name]);

  useEffect(() => {
    if (open && nameInputRef.current) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setAttribute(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setChangedFields(prev => new Set(prev).add(name));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: attribute.name,
      type: attribute.type,
      required: attribute.required || false,
      description: attribute.description || '',
      ...(attribute.enumValues ? { enumValues: attribute.enumValues } : {}),
      ...(attribute.items ? { items: attribute.items } : {})
    });
  };

  const isEditMode = !!initialAttribute.name;
  const isValid = attribute.name.trim() !== '' && !nameError;

  return (
    <Dialog 
      open={open} 
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: 'attribute-dialog'
      }}
    >
      <DialogTitle className="dialog-header">
        {isEditMode ? 'Edit Attribute' : 'Create New Attribute'}
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={attribute.name}
              onChange={handleChange}
              required
              ref={nameInputRef}
              className={`${nameError ? 'error-input' : ''} ${changedFields.has('name') ? 'changed' : ''}`}
            />
            {nameError && <div className="error-message">{nameError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={attribute.type}
              onChange={handleChange}
              className={changedFields.has('type') ? 'changed' : ''}
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="date">Date</option>
              <option value="object">Object</option>
              <option value="array">Array</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="required"
              name="required"
              checked={attribute.required || false}
              onChange={handleChange}
              className={changedFields.has('required') ? 'changed' : ''}
            />
            <label htmlFor="required">Required</label>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={attribute.description || ''}
              onChange={handleChange}
              className={changedFields.has('description') ? 'changed' : ''}
            />
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
        </form>
      </DialogContent>
    </Dialog>
  );
};
