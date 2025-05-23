import { render, fireEvent, screen, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EntityDialog } from '../EntityDialog';
import type { ApiEntity } from '../../../types/entities/entity';
import { Model, ModelStatus } from '../../../utils/Model';
import type { EntityAttribute } from '../../../types/entities/attributes';

let idCounter = 0;

class MockAttributeModel extends Model<EntityAttribute> {
  constructor(attribute: EntityAttribute) {
    super(attribute, ModelStatus.Pristine, () => attribute.id);
    this.id = `test-id-${idCounter++}`; // Ensure predictable ID for testing
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
  name: string,
  type: EntityAttribute['type'],
  required: boolean
): MockAttributeModel & EntityAttribute => {
  const attr: EntityAttribute = { id: `test-id-${idCounter++}`, name, type, required };
  const mock = new MockAttributeModel(attr);
  // Mix in EntityAttribute properties
  return Object.assign(mock, attr);
};



describe('EntityDialog', () => {
  const mockEntity: ApiEntity = {
    name: 'TestEntity',
    description: 'Test description',
    attributes: [
    createMockAttribute('id', 'string', true),
    createMockAttribute('createdAt', 'date', false)
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

    const table = screen.getByTestId('attribute-table');
    expect(table).toBeInTheDocument();
    
    const rows = within(table).getAllByTestId('attribute-row');
    expect(rows).toHaveLength(2);
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

    fireEvent.click(screen.getAllByRole('button', {name: 'Delete row'})[0]);
    fireEvent.click(screen.getAllByRole('button', {name: 'Undo row'})[0]);
    fireEvent.click(screen.getByRole('button', {name: 'Update'}));

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave.mock.calls[0][0].attributes).toHaveLength(2);
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

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'UpdatedEntity' }
    });

    // Verify no changes sent yet
    expect(mockOnSave).not.toHaveBeenCalled();

    // Click update using role selector to avoid conflict with table header
    fireEvent.click(screen.getByRole('button', {name: 'Update'}));

    // Verify changes sent
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    const savedEntity = mockOnSave.mock.calls[0][0];
    expect(savedEntity.name).toBe('UpdatedEntity');
  });

  it('discards changes when cancel is clicked', async () => {
    render(
      <EntityDialog
        entity={mockEntity}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={jest.fn()}
        open={true}
      />
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'UpdatedEntity' }
    });
    expect(screen.getByLabelText('Name')).toHaveValue('UpdatedEntity');

    fireEvent.click(screen.getByText('Cancel'));

    // Wait for state updates to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(screen.getByLabelText('Name')).toHaveValue('TestEntity');
  });
});
