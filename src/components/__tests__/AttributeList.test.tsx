import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AttributeList } from '../AttributeList';
import { EntityAttribute } from '../../types/entities/attributes';

jest.mock('../AttributeDialog', () => ({
  AttributeDialog: jest.fn(({ attribute, onSave, open }) => {
    if (!open) return null;
    return (
      <div role="dialog">
        <button onClick={() => onSave({...attribute, type: 'number'})}>
          Save
        </button>
      </div>
    );
  })
}));

describe('AttributeList', () => {
  const mockAttributes: EntityAttribute[] = [
    { name: 'username', type: 'string', required: true },
    { name: 'age', type: 'number', required: false }
  ];

  const mockOnAdd = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnUndoDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all attributes', () => {
    render(
      <AttributeList
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set()}
        deletedAttributes={new Set()}
      />
    );

    expect(screen.getByText('username')).toBeVisible();
    expect(screen.getByText('string')).toBeVisible();
    expect(screen.getByText('Yes')).toBeVisible();
    expect(screen.getByText('age')).toBeVisible();
    expect(screen.getByText('number')).toBeVisible();
    expect(screen.getByText('No')).toBeVisible();
  });

  it('calls onAdd when add button is clicked', () => {
    render(
      <AttributeList
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

  it('opens dialog with correct attribute when edit icon button is clicked', () => {
    render(
      <AttributeList
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set()}
        deletedAttributes={new Set()}
      />
    );

    fireEvent.click(screen.getByLabelText('Edit username'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onEdit with saved attribute when dialog is saved', () => {
    render(
      <AttributeList
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set()}
        deletedAttributes={new Set()}
      />
    );

    fireEvent.click(screen.getByLabelText('Edit username'));
    const updatedAttribute = {...mockAttributes[0], type: 'number'};
    fireEvent.click(screen.getByRole('button', {name: /save/i}));
    expect(mockOnEdit).toHaveBeenCalledWith(updatedAttribute);
  });

  it('calls onDelete with correct attribute name when delete icon button is clicked', () => {
    render(
      <AttributeList
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set()}
        deletedAttributes={new Set()}
      />
    );

    fireEvent.click(screen.getByLabelText('Delete username'));
    expect(mockOnDelete).toHaveBeenCalledWith('username');
  });

  it('calls onUndoDelete with correct attribute name when undo icon button is clicked', () => {
    render(
      <AttributeList
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set()}
        deletedAttributes={new Set(['username'])}
      />
    );

    fireEvent.click(screen.getByLabelText('Undo delete username'));
    expect(mockOnUndoDelete).toHaveBeenCalledWith('username');
  });

  it('when attributes are marked for deletion > shows deleted attributes with strikeout text and reduced opacity', () => {
    render(
      <AttributeList
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set()}
        deletedAttributes={new Set(['username'])}
      />
    );

    const usernameRow = screen.getByText('username').closest('.attribute-list-row');
    expect(usernameRow).toBeInTheDocument();
    expect(usernameRow).toHaveClass('deleted');
    
    // Verify deleted class is applied
    expect(usernameRow).toHaveClass('deleted');
  });

  it('renders visible icons for all action buttons', () => {
    render(
      <AttributeList
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set()}
        deletedAttributes={new Set()}
      />
    );

    const editButton = screen.getByLabelText('Edit username');
    const deleteButton = screen.getByLabelText('Delete username');
    const addButton = screen.getByRole('button', { name: /add/i });

  
    expect(editButton).toBeInTheDocument();
    expect(editButton).toBeVisible();
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toBeVisible();

    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeVisible();

  });

  it('when attributes are marked for deletion > shows visible undo icon for deleted attributes', () => {
    render(
      <AttributeList
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set()}
        deletedAttributes={new Set(['username'])}
      />
    );

    const undoButton = screen.getByLabelText('Undo delete username');
    expect(undoButton).toHaveClass('undo-button');

  });

  it('when attributes are marked for deletion > disables edit icon button for deleted attributes', () => {
    render(
      <AttributeList
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set()}
        deletedAttributes={new Set(['username'])}
      />
    );

    const editButton = screen.queryByRole('button', { name: /edit username/i });
    expect(editButton).toBeNull();
  });

  it('sorts attributes alphabetically', () => {
    render(
      <AttributeList
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set()}
        deletedAttributes={new Set()}
      />
    );

    // Initial sort is ascending
    const rows = screen.getAllByTestId('attribute-name');
    expect(rows[0]).toHaveTextContent('age');
    expect(rows[1]).toHaveTextContent('username');

    // Click sort button to toggle to descending
    fireEvent.click(screen.getByLabelText('Sort descending'));

    const updatedRows = screen.getAllByTestId('attribute-name');
    expect(updatedRows[0]).toHaveTextContent('username');
    expect(updatedRows[1]).toHaveTextContent('age');
  });

  it('puts modified attributes first in the list', () => {
    render(
      <AttributeList
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndoDelete={mockOnUndoDelete}
        changedAttributes={new Set(['age'])}
        deletedAttributes={new Set()}
      />
    );

    const rows = screen.getAllByTestId('attribute-name');
    expect(rows[0]).toHaveTextContent('age');
    expect(rows[1]).toHaveTextContent('username');
  });
});
