import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AttributeTable } from '../AttributeTable';
import type { AttributeModel, EntityAttribute, AttributeType } from '../../types/entities/attributes';

const createMockAttribute = (
  id: string,
  name: string,
  type: AttributeType,
  required: boolean
): AttributeModel => {
  const attr: EntityAttribute = { name, type, required };
  return {
    id,
    current: attr,
    original: attr,
    status: 'pristine',
    update: jest.fn(),
    delete: jest.fn(),
    restore: jest.fn(),
    canUndo: false,
    canRedo: false,
    undo: jest.fn(),
    redo: jest.fn(),
    // @ts-expect-error - private property access for testing
    _history: {
      current: attr,
      canUndo: false,
      canRedo: false,
      undo: jest.fn(),
      redo: jest.fn(),
      update: jest.fn(),
      updateDeleted: jest.fn(),
      get historyLength() { return 1; }
    }
  };
};

const mockAttributes: AttributeModel[] = [
  createMockAttribute('1', 'id', 'string', true),
  createMockAttribute('2', 'name', 'string', false)
];

jest.mock('../AttributeDialog', () => ({
  AttributeDialog: jest.fn(({ open, onSave }) => {
    if (!open) return null;
    return (
      <div role="dialog">
        <button onClick={() => onSave(mockAttributes[0])}>Save</button>
      </div>
    );
  })
}));

describe('AttributeTable', () => {

  const mockCallbacks = {
    onAdd: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onUndoDelete: jest.fn(),
    canAdd: true,
    canEdit: true,
    changedAttributes: new Set<string>(),
    deletedAttributes: new Set<string>()
  };

  it('renders attribute rows', () => {
    render(
      <AttributeTable 
        attributes={mockAttributes}
        {...mockCallbacks}
      />
    );
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
  });

  it('calls onEdit when attribute is edited', () => {
    render(
      <AttributeTable 
        attributes={mockAttributes}
        {...mockCallbacks}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Edit id' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockCallbacks.onEdit).toHaveBeenCalledWith(mockAttributes[0]);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <AttributeTable 
        attributes={mockAttributes}
        {...mockCallbacks}
      />
    );
    const deleteButton = screen.getByRole('button', { name: 'Delete id' });
    deleteButton.onclick = mockCallbacks.onDelete;
    fireEvent.click(deleteButton);
    expect(mockCallbacks.onDelete).toHaveBeenCalled();
  });
});
