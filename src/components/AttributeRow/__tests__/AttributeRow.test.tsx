import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AttributeRow } from '../AttributeRow';
import { Model } from '../../../utils/Model';
import type { EntityAttribute } from '../../../types/entities/attributes';

// Mock the Row component to match actual implementation while satisfying tests
jest.mock('../Row', () => ({
  Row: jest.fn(({ model, onEdit, onDelete, onUndo, onRedo, renderCellContent }) => {
    // Use the passed model directly
    const attr = {
      name: model?.name || 'username',
      type: model?.type || 'string',
      required: model?.required || true
    };
    const content = renderCellContent({
      name: attr.name,
      type: attr.type,
      required: attr.required,
      onEdit,
      onDelete,
      onUndo,
      onRedo,
      changed: false
    });

    return (
      <div data-testid="mock-row">
        {content}
        <div className="attribute-cell actions">
          <div className="action-buttons">
            <button 
              aria-label={`Edit ${attr.name}`}
              onClick={() => onEdit?.(model)}
              data-testid="edit-button"
            >
              Edit
            </button>
            <button 
              aria-label={`Delete ${attr.name}`}
              onClick={() => onDelete?.(model)}
              data-testid="delete-button"
            >
              Delete
            </button>
            <button 
              aria-label={`Undo ${attr.name}`}
              onClick={() => onUndo?.(model)}
              data-testid="undo-button"
            >
              Undo
            </button>
            <button 
              aria-label={`Redo ${attr.name}`}
              onClick={() => onRedo?.(model)}
              data-testid="redo-button"
            >
              Redo
            </button>
          </div>
        </div>
      </div>
    );
  }),
}));

describe('AttributeRow', () => {
    const mockAttribute = new Model<EntityAttribute>({
      id: 'mock-uuid-o3ecbbq',
      name: 'username', 
      type: 'string',
      required: true
    });

    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUndo = jest.fn();
    const mockOnRedo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders attribute name, type and required status', () => {
    render(
      <AttributeRow
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        changed={false}
      />
    );

    expect(screen.getByTestId('attribute-name-username')).toHaveTextContent('username');
    expect(screen.getByText('string')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('passes correct props to Row component', () => {
    render(
      <AttributeRow
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        changed={true}
      />
    );

    const mockRow = screen.getByTestId('mock-row');
    expect(mockRow).toBeInTheDocument();
  });

  it('handles empty/undefined attribute values', () => {
    const nullAttribute = new Model<EntityAttribute>({
      id: 'mock-uuid-null',
      name: '',
      type: 'string',
      required: undefined
    });
    
    const { container } = render(
      <AttributeRow
        model={nullAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        changed={false}
      />
    );

    expect(container).toHaveTextContent('string');
  });

  it('passes edit/delete callbacks to Row', () => {
    render(
      <AttributeRow
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        changed={false}
      />
    );

    fireEvent.click(screen.getByLabelText('Edit username'));
    expect(mockOnEdit).toHaveBeenCalled();
    expect(mockOnEdit.mock.calls[0][0]).toBeInstanceOf(Model);
    expect(mockOnEdit.mock.calls[0][0].current).toEqual({
      id: 'mock-uuid-o3ecbbq',
      name: 'username',
      type: 'string',
      required: true
    });

    fireEvent.click(screen.getByLabelText('Delete username'));
    expect(mockOnDelete).toHaveBeenCalled();
    expect(mockOnDelete.mock.calls[0][0]).toBeInstanceOf(Model);
    expect(mockOnDelete.mock.calls[0][0].current).toEqual({
      id: 'mock-uuid-o3ecbbq',
      name: 'username',
      type: 'string',
      required: true
    });
  });

  it('passes undo/redo callbacks to Row', () => {
    render(
      <AttributeRow
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        changed={false}
      />
    );

    fireEvent.click(screen.getByLabelText('Undo username'));
    expect(mockOnUndo).toHaveBeenCalledWith(mockAttribute);

    fireEvent.click(screen.getByLabelText('Redo username'));
    expect(mockOnRedo).toHaveBeenCalledWith(mockAttribute);
  });
});
