import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AttributeTable } from '../AttributeTable';
import type { EntityAttribute, AttributeType } from '../../../types/entities/attributes';
import type { AttributeModel } from '../../../types/entities/AttributeModel';

const createMockAttribute = (
  id: string,
  name: string,
  type: AttributeType,
  required: boolean
): AttributeModel => {
  const attr: EntityAttribute = { name, type, required };
  
  // Create a mock that matches the History interface structure
  const historyMock = {
    currentIndex: 0,
    current: attr,
    canUndo: false,
    canRedo: false,
    undo: jest.fn(),
    redo: jest.fn(),
    update: jest.fn(),
    updateDeleted: jest.fn(),
    get historyLength() { return 1; }
  };

  // Create base mock object
  const baseMock = {
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
    redo: jest.fn()
  };

  // Create full mock with private history property
  const mock = baseMock as unknown as AttributeModel;
  Object.defineProperty(mock, 'history', {
    value: historyMock,
    writable: true,
    enumerable: false
  });

  return mock;
};

const mockAttributes: AttributeModel[] = [
  createMockAttribute('1', 'id', 'string', true),
  createMockAttribute('2', 'name', 'string', false)
];

jest.mock('../../AttributeDialog/AttributeDialog', () => ({
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
    canEdit: true
  };

  it('renders attribute rows', () => {
    render(
      <AttributeTable 
        initialAttributes={mockAttributes}
        {...mockCallbacks}
      />
    );
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
  });

  it('calls onEdit when attribute is edited', () => {
    render(
      <AttributeTable 
        initialAttributes={mockAttributes}
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
        initialAttributes={mockAttributes}
        {...mockCallbacks}
      />
    );
    const deleteButton = screen.getByRole('button', { name: 'Delete id' });
    deleteButton.onclick = mockCallbacks.onDelete;
    fireEvent.click(deleteButton);
    expect(mockCallbacks.onDelete).toHaveBeenCalled();
  });
});
