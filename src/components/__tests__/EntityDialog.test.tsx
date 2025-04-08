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
        open={true}
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
        open={true}
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
        open={true}
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

    const backdrop = document.querySelector('.MuiBackdrop-root');
    fireEvent.click(backdrop!);
    expect(mockOnClose).toHaveBeenCalled();
  });

});
