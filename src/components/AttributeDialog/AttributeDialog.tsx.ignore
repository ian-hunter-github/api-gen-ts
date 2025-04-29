import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import type { Model } from '../../utils/Model';
import type { EntityAttribute } from '../../types/entities/attributes';
import './AttributeDialog.css';

interface AttributeDialogProps {
  attribute: Model<EntityAttribute>;
  existingNames: string[];
  onSave: (attribute: Model<EntityAttribute>) => void;
  onCancel: () => void;
  open: boolean;
}

export const AttributeDialog: React.FC<AttributeDialogProps> = ({ 
  attribute: initialModel,
  existingNames,
  onSave,
  onCancel,
  open = false
}) => {
  const [attribute, setAttribute] = useState<EntityAttribute>(initialModel.current || {
    id: uuidv4(),
    name: '',
    type: 'string',
    required: false,
    description: ''
  });
  const [nameError, setNameError] = useState<string>('');
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (attribute.name) {
      const isUnique = !existingNames.includes(attribute.name) || 
                      (initialModel.current && attribute.name === initialModel.current.name);
      setNameError(isUnique ? '' : 'Attribute name must be unique within entity');
    } else {
      setNameError('');
    }
  }, [attribute.name, existingNames, initialModel.current]);

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
    initialModel.update({
      name: attribute.name,
      type: attribute.type,
      required: attribute.required || false,
      description: attribute.description || '',
      ...(attribute.enumValues ? { enumValues: attribute.enumValues } : {}),
      ...(attribute.items ? { items: attribute.items } : {})
    });
    onSave(initialModel);
  };

  const isEditMode = !!(initialModel.current && initialModel.current.name);
  const isValid = attribute.name.trim() !== '' && !nameError;

  const handleClose = (reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick' && changedFields.size > 0) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        return;
      }
    }
    onCancel();
  };

  return (
    <Dialog 
      open={open} 
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: 'attribute-dialog'
      }}
      onClose={handleClose}
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
