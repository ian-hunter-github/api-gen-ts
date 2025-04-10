import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AttributeRowView } from '../AttributeRowView';
import { AttributeModel } from '../../types/entities/attributes';

describe('AttributeRowView', () => {
  const mockAttribute = new AttributeModel({
    name: 'username',
    type: 'string',
    required: true
  });

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnRestore = jest.fn();
  const mockOnUndo = jest.fn();
  const mockOnRedo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders attribute name, type and required status', () => {
    render(
      <AttributeRowView
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRestore={mockOnRestore}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        deleted={false}
        changed={false}
      />
    );

    expect(screen.getByText('username')).toBeVisible();
    expect(screen.getByText('string')).toBeVisible();
    expect(screen.getByText('Yes')).toBeVisible();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <AttributeRowView
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRestore={mockOnRestore}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        deleted={false}
        changed={false}
      />
    );

    fireEvent.click(screen.getByLabelText('Edit username'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockAttribute);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <AttributeRowView
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRestore={mockOnRestore}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        deleted={false}
        changed={false}
      />
    );

    fireEvent.click(screen.getByLabelText('Delete username'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockAttribute);
  });

  it('calls onRestore when undo button is clicked', () => {
    render(
      <AttributeRowView
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRestore={mockOnRestore}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        deleted={true}
        changed={false}
      />
    );

    fireEvent.click(screen.getByLabelText('Restore username'));
    expect(mockOnRestore).toHaveBeenCalledWith(mockAttribute);
  });

  it('applies changed styling when changed is true', () => {
    render(
      <AttributeRowView
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRestore={mockOnRestore}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        deleted={false}
        changed={true}
      />
    );

    const row = screen.getByText('username').closest('tr');
    expect(row).toHaveClass('changed');
  });

  it('applies deleted styling when deleted is true', () => {
    render(
      <AttributeRowView
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRestore={mockOnRestore}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        deleted={true}
        changed={false}
      />
    );

    const row = screen.getByText('username').closest('tr');
    expect(row).toHaveClass('deleted');
  });

  it('shows restore button instead of edit/delete when deleted is true', () => {
    render(
      <AttributeRowView
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRestore={mockOnRestore}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        deleted={true}
        changed={false}
      />
    );

    expect(screen.queryByLabelText('Edit username')).toBeNull();
    expect(screen.queryByLabelText('Delete username')).toBeNull();
    expect(screen.getByLabelText('Restore username')).toBeVisible();
  });
});
