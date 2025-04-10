import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { AttributesTable } from '../AttributesTable';
import { AttributeModel } from '../../types/entities/attributes';

describe('AttributesTable', () => {
  const mockAttributes = [
    new AttributeModel({
      name: 'id',
      type: 'string',
      required: true,
    }),
    new AttributeModel({
      name: 'name',
      type: 'string',
      required: true,
    }),
  ];

  const mockOnAdd = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnUndoDelete = jest.fn();

  it('renders the table with attributes', () => {
    render(
      <AttributesTable
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set()}
        deletedAttributes={new Set()}
      />
    );

    expect(screen.getByTestId('attribute-name-id')).toHaveTextContent('id');
    expect(screen.getByTestId('attribute-name-name')).toHaveTextContent('name');
  });

  it('calls onAdd when add button is clicked', () => {
    render(
      <AttributesTable
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set()}
        deletedAttributes={new Set()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(mockOnAdd).toHaveBeenCalled();
  });

  it('opens dialog when edit button is clicked', () => {
    render(
      <AttributesTable
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set()}
        deletedAttributes={new Set()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Edit id' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onDelete with attribute name when delete button is clicked', () => {
    render(
      <AttributesTable
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set()}
        deletedAttributes={new Set()}
      />
    );

    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
    expect(mockOnDelete).toHaveBeenCalledWith('id');
  });

  it('shows changed attributes with modified styling', () => {
    render(
      <AttributesTable
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set(['name'])}
        deletedAttributes={new Set()}
      />
    );

    const nameRow = screen.getByTestId('attribute-name-name').closest('.table-row');
    expect(nameRow).toHaveClass('changed');
  });

  it('shows deleted attributes with deleted styling', () => {
    render(
      <AttributesTable
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set()}
        deletedAttributes={new Set(['id'])}
      />
    );

    const idRow = screen.getByTestId('attribute-name-id').closest('.table-row');
    expect(idRow).toHaveClass('deleted');
  });
});
