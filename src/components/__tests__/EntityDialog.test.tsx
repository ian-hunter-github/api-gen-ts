import { render, fireEvent, screen, act } from '@testing-library/react';
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
        onClose={jest.fn()}
        open={true}
      />
    );

    expect(screen.getByText(/Create New Entity|Edit/)).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Description')).toHaveValue('');
    expect(screen.queryAllByTestId('attribute-name')).toHaveLength(0);
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
    
    const attributeNames = screen.getAllByTestId('attribute-name');
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

  it('handles adding new attributes', () => {
    render(
      <EntityDialog
        entity={mockEntity}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={jest.fn()}
        open={true}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    expect(mockOnSave).toHaveBeenCalled();
    const savedEntity = mockOnSave.mock.calls[0][0];
    expect(savedEntity.attributes.length).toBe(3);
    expect(savedEntity.attributes[2].name).toMatch(/new_attribute_\d+/);
    expect(savedEntity.attributes[2].modified).toBe(true);
  });


  it('handles deleting attributes', () => {
    render(
      <EntityDialog
        entity={mockEntity}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onClose={jest.fn()}
        open={true}
      />
    );

    // Get initial attribute names
    const initialAttributes = screen.getAllByTestId('attribute-name').map(el => el.textContent);
    
    // Delete first attribute
    fireEvent.click(screen.getAllByLabelText(/Delete/i)[0]);
    fireEvent.click(screen.getByText('Update'));

    expect(mockOnSave).toHaveBeenCalled();
    const savedEntity = mockOnSave.mock.calls[0][0];
    
    // Should have one less attribute
    expect(savedEntity.attributes.length).toBe(mockEntity.attributes.length - 1);
    
    // The remaining attribute should be one of the original ones
    const remainingNames = savedEntity.attributes.map((attr: ApiEntity['attributes'][0]) => attr.name);
    expect(initialAttributes).toEqual(expect.arrayContaining(remainingNames));
    
    // Verify exactly one attribute was removed
    const removedNames = initialAttributes.filter(name => !remainingNames.includes(name!));
    expect(removedNames).toHaveLength(1);
  });

  it('handles undoing attribute deletes', () => {
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
    fireEvent.click(screen.getByRole('button', { name: /Undo delete/i }));
    fireEvent.click(screen.getByText('Update'));

    expect(mockOnSave).toHaveBeenCalled();
    const savedEntity = mockOnSave.mock.calls[0][0];
    expect(savedEntity.attributes.length).toBe(2);
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

    expect(screen.getAllByTestId('attribute-name')).toHaveLength(2);
  });
});
