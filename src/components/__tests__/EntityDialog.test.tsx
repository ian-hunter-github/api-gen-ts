import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EntityDialog } from '../EntityDialog';
import type { ApiEntity } from '../../types/entities/entity';

describe('EntityDialog', () => {
  const mockEntity: ApiEntity = {
    name: 'TestEntity',
    description: 'Test description',
    attributes: [
      { name: 'id', type: 'string', required: true },
      { name: 'createdAt', type: 'date', required: false }
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
      />
    );

    expect(screen.getByText('Create New Entity')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Description')).toHaveValue('');
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('renders in edit mode with populated entity', () => {
    render(
      <EntityDialog 
        entity={mockEntity} 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
      />
    );

    expect(screen.getByText('Edit TestEntity')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('TestEntity');
    expect(screen.getByLabelText('Description')).toHaveValue('Test description');
    
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('string')).toBeInTheDocument();
    expect(screen.getByText('createdAt')).toBeInTheDocument();
    expect(screen.getByText('date')).toBeInTheDocument();
  });

  it('calls onSave with updated entity when form is submitted', () => {
    render(
      <EntityDialog 
        entity={mockEntity} 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
      />
    );

    fireEvent.change(screen.getByLabelText('Name'), {
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
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('updates state when attribute is deleted', async () => {
    render(
      <EntityDialog 
        entity={mockEntity} 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
      />
    );

    // Find and click delete button for first attribute
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButtons[0]);

    // Verify UI updates
    await waitFor(() => {
      expect(screen.queryByText('createdAt')).not.toBeInTheDocument();
      expect(screen.getByText('id')).toBeInTheDocument();
    });
  });

  it('calls onSave with correct data after attribute deletion', async () => {
    let savedEntity: ApiEntity | null = null;
    const handleSave = (entity: ApiEntity) => {
      savedEntity = entity;
      mockOnSave(entity);
    };

    render(
      <EntityDialog 
        entity={mockEntity} 
        onSave={handleSave} 
        onCancel={mockOnCancel} 
      />
    );

    // Delete the 'id' attribute
    const idRow = screen.getByText('id').closest('tr');
    const deleteButton = idRow?.querySelector('button[aria-label="Delete"]');
    if (deleteButton) {
      fireEvent.click(deleteButton);
    }

    // Wait for UI to update
    await waitFor(() => {
      expect(screen.queryByText('id')).not.toBeInTheDocument();
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    // Verify saved data
    await waitFor(() => {
      expect(savedEntity).not.toBeNull();
      expect(savedEntity?.attributes).toHaveLength(1);
      expect(savedEntity?.attributes[0].name).toBe('createdAt');
      expect(mockOnSave).toHaveBeenCalledWith(savedEntity);
    });
  });

  it('disables save button when name is empty', () => {
    render(
      <EntityDialog 
        entity={emptyEntity} 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
      />
    );

    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  it('enables save button when name is not empty', () => {
    render(
      <EntityDialog 
        entity={{ ...emptyEntity, name: 'Test' }} 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
      />
    );

    expect(screen.getByRole('button', { name: 'Update' })).toBeEnabled();
  });

  it('shows relationship and endpoints buttons', () => {
    render(
      <EntityDialog 
        entity={mockEntity} 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
      />
    );

    expect(screen.getByText('Relationships')).toBeInTheDocument();
    expect(screen.getByText('Endpoints')).toBeInTheDocument();
  });

  it('renders attributes in alphabetical order', async () => {
    const unsortedEntity: ApiEntity = {
      ...mockEntity,
      attributes: [
        { name: 'zAttribute', type: 'string', required: true },
        { name: 'aAttribute', type: 'number', required: false },
        { name: 'mAttribute', type: 'boolean', required: true }
      ]
    };

    render(
      <EntityDialog 
        entity={unsortedEntity} 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
      />
    );

    // Wait for all attributes to be rendered
    await screen.findByText('aAttribute');
    await screen.findByText('mAttribute');
    await screen.findByText('zAttribute');
    
    // Get all attribute name elements and verify order
    const attributeNames = screen.getAllByTestId('attribute-name');
    expect(attributeNames[0]).toHaveTextContent('aAttribute');
    expect(attributeNames[1]).toHaveTextContent('mAttribute');
    expect(attributeNames[2]).toHaveTextContent('zAttribute');
  });
});
