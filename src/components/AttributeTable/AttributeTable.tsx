import React, { useState, useMemo } from 'react';
import './AttributeTable.css';
import type { AttributeModel } from '../../types/entities/attributes';
import { AttributeDialog } from '../AttributeDialog/AttributeDialog';
import { AttributeRowView } from '../AttributeRowView/AttributeRowView';

interface AttributeTableProps {
  initialAttributes: AttributeModel[];
  onAdd: () => void;
  onEdit: (attribute: AttributeModel) => void;
  onChange?: () => void;
}

export const AttributeTable = React.forwardRef<{
  getAttributes: () => AttributeModel[];
}, AttributeTableProps>(({
  initialAttributes,
  onAdd,
  onEdit,
  onChange,
}, ref) => {
  const [attributes, setAttributes] = useState<AttributeModel[]>(initialAttributes);
  const [currentAttribute, setCurrentAttribute] = useState<AttributeModel | null>(null);
  const [isAttributeDialogOpen, setIsAttributeDialogOpen] = useState(false);

  const handleEdit = (attribute: AttributeModel) => {
    // Skip edit if attribute is deleted or has no current state
    if (attribute.status === 'deleted' || !attribute.current) {
      return;
    }
    setCurrentAttribute(attribute);
    setIsAttributeDialogOpen(true);
  };

  const handleDelete = (attributeName: string) => {
    const attribute = attributes.find(a => 
      a.current !== null && a.current.name === attributeName
    );
    if (attribute) {
      attribute.delete();
      setAttributes(prev => [...prev]); // Force re-render
      onChange?.();
    }
  };

  React.useImperativeHandle(ref, () => ({
    getAttributes: () => {
      return attributes.filter(attr => attr.status !== 'deleted');
    }
  }), [attributes]);

  const existingNames = useMemo(() => 
    attributes
      .filter(attr => attr.current !== null)
      .map(attr => attr.current!.name), 
    [attributes]
  );

  const handleSave = (attribute: AttributeModel) => {
    if (!attribute.current) return;
    
    setAttributes(prev => 
      prev.map(a => {
        if (!a.current || !attribute.current) return a;
        return a.current.name === attribute.current.name ? attribute : a;
      })
    );
    setIsAttributeDialogOpen(false);
    onEdit(attribute);
    onChange?.();
  };

  const handleCancel = () => {
    setIsAttributeDialogOpen(false);
  };

  const processedAttributes = [...attributes]
    .sort((a, b) => {
      const aName = a.current ? a.current.name : a.previous?.name || '';
      const bName = b.current ? b.current.name : b.previous?.name || '';
      return aName.localeCompare(bName);
    });

  return (
    <div className="attribute-table">
      {currentAttribute && (
        <AttributeDialog
          attribute={currentAttribute}
          existingNames={existingNames}
          onSave={handleSave}
          onCancel={handleCancel}
          open={isAttributeDialogOpen}
        />
      )}
      <div className="attribute-table-header">
        <h3>Attributes</h3>
        <button className="add-button" onClick={onAdd}>
          <span className="material-icons">add</span>
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="table-header-cell">Name</div>
          <div className="table-header-cell">Type</div>
          <div className="table-header-cell">Required</div>
          <div className="table-header-cell">Actions</div>
        </div>
        <div className="table-body">
          {processedAttributes.map((attribute: AttributeModel) => (
            <AttributeRowView
              key={attribute.id}
              model={attribute}
              onEdit={() => attribute.status !== 'deleted' && handleEdit(attribute)}
              onDelete={() => attribute.current ? handleDelete(attribute.current.name) : undefined}
              onUndo={() => {
                attribute.undo();
                setAttributes(prev => [...prev]);
                onChange?.();
              }}
              onRedo={() => {
                attribute.redo();
                setAttributes(prev => [...prev]);
                onChange?.();
              }}
              deleted={attribute.status === 'deleted'}
              changed={attribute.status === 'modified'}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
