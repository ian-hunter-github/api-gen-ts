import { render, fireEvent, screen } from '@testing-library/react';
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

  beforeEach(() => {
    jest.clearAllMocks();
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
    fireEvent.click(screen.getByRole('button', { name: /(Update|Add)/ }));

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

  it('removes attribute when delete button is clicked', () => {
    render(
      <EntityDialog 
        entity={mockEntity} 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
      />
    );

    const deleteButtons = screen.getAllByText('🗑️');
    fireEvent.click(deleteButtons[0]);

    expect(screen.queryByText('id')).not.toBeInTheDocument();
    expect(screen.getByText('createdAt')).toBeInTheDocument();
    expect(screen.getByText('date')).toBeInTheDocument();
  });

  it('disables save button when name is empty', () => {
    render(
      <EntityDialog 
        entity={emptyEntity} 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
      />
    );

    expect(screen.getByRole('button', { name: /(Update|Add)/ })).toBeDisabled();
  });

  it('enables save button when name is not empty', () => {
    render(
      <EntityDialog 
        entity={{ ...emptyEntity, name: 'Test' }} 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
      />
    );

    expect(screen.getByRole('button', { name: /(Update|Add)/ })).toBeEnabled();
  });

  it('shows relationship and endpoints buttons', () => {
    render(
      <EntityDialog 
        entity={mockEntity} 
        onSave={mockOnSave} 
        onCancel={mockOnCancel} 
      />
    );

    expect(screen.getByText('Relationships...')).toBeInTheDocument();
    expect(screen.getByText('Endpoints...')).toBeInTheDocument();
  });
});
