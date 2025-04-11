import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EntityDialog } from '../EntityDialog';
import type { ApiEntity } from '../../../types/entities/entity';
import { AttributeModel } from '../../../types/entities/attributes';
import type { EntityAttribute } from '../../../types/entities/attributes';

class MockAttributeModel extends AttributeModel {
  constructor(attribute: EntityAttribute, status: 'pristine' | 'modified' | 'deleted' | 'new' = 'pristine') {
    super(attribute, status);
    // Mock methods
    this.update = jest.fn();
    this.delete = jest.fn();
    this.restore = jest.fn();
    this.undo = jest.fn();
    this.redo = jest.fn();
  }

  // Override getters to make them mockable
  get canUndo(): boolean {
    return false;
  }

  get canRedo(): boolean {
    return false;
  }
}

const createMockAttribute = (
  id: string,
  name: string,
  type: EntityAttribute['type'],
  required: boolean
): MockAttributeModel & EntityAttribute => {
  const attr: EntityAttribute = { name, type, required };
  const mock = new MockAttributeModel(attr);
  // Set mock ID
  Object.defineProperty(mock, 'id', { value: id });
  // Mix in EntityAttribute properties
  return Object.assign(mock, attr);
};

describe('EntityDialog', () => {
  const mockEntity: ApiEntity = {
    name: 'TestEntity',
    description: 'Test description',
    attributes: [
    createMockAttribute('1', 'id', 'string', true),
    createMockAttribute('2', 'createdAt', 'date', false)
    ]
  };

  const emptyEntity: ApiEntity = {
    name: '',
    description: '',
    attributes: []
  };

  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();
  let container: HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  it('renders in create mode with empty entity', () => {
    render(
      <EntityDialog 
        entity={emptyEntity} 
        onSave={mockOnSave} 
        onCancel={mockOnCancel}
        onClose={jest.fn()}
        open={true}
      />
    );

    expect(screen.getByText(/Create New Entity|Edit/)).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Description')).toHaveValue('');
    expect(screen.queryAllByTestId(/^attribute-name-/)).toHaveLength(0);
  });

  it('renders in edit mode with populated entity', () => {
    render(
      <EntityDialog
        entity={mockEntity}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={jest.fn()}
        open={true}
      />
    );

    expect(screen.getByText('Edit TestEntity')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('TestEntity');
    expect(screen.getByLabelText('Description')).toHaveValue('Test description');
    
    const attributeNames = screen.getAllByTestId(/^attribute-name-/);
    const attributeTexts = attributeNames.map(el => el.textContent);
    expect(attributeTexts).toContain('id');
    expect(attributeTexts).toContain('createdAt');
  });

  it('calls onSave with updated entity when form is submitted', () => {
    render(
      <EntityDialog
        entity={mockEntity}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={jest.fn()}
        open={true}
      />
    );

    fireEvent.change(screen.getByRole('textbox', { name: /name/i }), {
      target: { value: 'UpdatedEntity' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    expect(mockOnSave).toHaveBeenCalledWith({
      ...mockEntity,
      name: 'UpdatedEntity'
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <EntityDialog
        entity={mockEntity}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={jest.fn()}
        open={true}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('does not render when open is false', () => {
    const { container } = render(
      <EntityDialog
        entity={mockEntity}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={jest.fn()}
        open={false}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const mockOnClose = jest.fn();
    render(
      <EntityDialog 
        entity={mockEntity}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={mockOnClose}
        open={true}
      />
    );

    const backdrop = document.querySelector('.entity-dialog-overlay');
    if (!backdrop) {
      throw new Error('Backdrop element not found');
    }
    fireEvent.click(backdrop);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('passes initial attributes to AttributeTable', () => {
    render(
      <EntityDialog
        entity={mockEntity}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={jest.fn()}
        open={true}
      />
    );

    const attributeNames = screen.getAllByTestId(/^attribute-name-/).map(el => el.textContent);
    expect(attributeNames).toHaveLength(2);
    expect(attributeNames).toContain('id');
    expect(attributeNames).toContain('createdAt');
  });

  it('gets final attributes from AttributeTable on save', () => {
    render(
      <EntityDialog
        entity={mockEntity}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={jest.fn()}
        open={true}
      />
    );

    fireEvent.click(screen.getAllByLabelText(/Delete/i)[0]);
    fireEvent.click(screen.getByLabelText('Undo delete createdAt'));
    fireEvent.click(screen.getByText('Update'));

    expect(mockOnSave).toHaveBeenCalled();
    const savedEntity = mockOnSave.mock.calls[0][0];
    expect(savedEntity.attributes.length).toBe(2);
    expect(savedEntity.attributes[1].status).toBe('pristine');
  });

  it('preserves entity-level changes while handling attributes', () => {
    render(
      <EntityDialog
        entity={mockEntity}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={jest.fn()}
        open={true}
      />
    );

    // Make multiple changes
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    fireEvent.click(screen.getAllByLabelText(/Delete/i)[0]);
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'UpdatedEntity' }
    });

    // Verify no changes sent yet
    expect(mockOnSave).not.toHaveBeenCalled();

    // Click update
    fireEvent.click(screen.getByText('Update'));

    // Verify all changes sent together
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    const savedEntity = mockOnSave.mock.calls[0][0];
    expect(savedEntity.name).toBe('UpdatedEntity');
    expect(savedEntity.attributes.length).toBe(2); // 1 deleted, 1 added
  });

  it('discards changes when cancel is clicked', () => {
    const { rerender } = render(
      <EntityDialog
        entity={mockEntity}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={jest.fn()}
        open={true}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    fireEvent.click(screen.getByText('Cancel'));

    rerender(
      <EntityDialog
        entity={mockEntity}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={jest.fn()}
        open={true}
      />
    );

    expect(screen.getAllByTestId(/^attribute-name-/)).toHaveLength(2);
  });
});
