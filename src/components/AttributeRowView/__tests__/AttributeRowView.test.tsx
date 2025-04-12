import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import '../AttributeRowView.css';
import { AttributeRowView } from '../AttributeRowView';
import { AttributeModel } from '../../../types/entities/attributes';

describe('AttributeRowView', () => {
  const mockAttribute = new AttributeModel({
    name: 'username',
    type: 'string',
    required: true
  });

  // Mock methods using jest.spyOn
  jest.spyOn(mockAttribute, 'update').mockImplementation(jest.fn());
  jest.spyOn(mockAttribute, 'delete').mockImplementation(jest.fn());
  jest.spyOn(mockAttribute, 'restore').mockImplementation(jest.fn());
  jest.spyOn(mockAttribute, 'undo').mockImplementation(jest.fn());
  jest.spyOn(mockAttribute, 'redo').mockImplementation(jest.fn());

  // Mock history state
  jest.spyOn(mockAttribute, 'canUndo', 'get').mockReturnValue(false);
  jest.spyOn(mockAttribute, 'canRedo', 'get').mockReturnValue(false);

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
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
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        deleted={false}
        changed={false}
      />
    );

    fireEvent.click(screen.getByLabelText('Delete username'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockAttribute);
  });

  it('calls onUndo when undo button is clicked', () => {
    // Enable undo for this test
    jest.spyOn(mockAttribute, 'canUndo', 'get').mockReturnValue(true);
    
    render(
      <AttributeRowView
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        deleted={false}
        changed={true}
      />
    );

    const button = screen.getByLabelText('Undo delete username');
    expect(button).toBeEnabled();

    fireEvent.click(button);

    expect(mockOnUndo).toHaveBeenCalledWith(mockAttribute);
  });

  it('applies changed styling when changed is true', () => {
    render(
      <AttributeRowView
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        deleted={false}
        changed={true}
      />
    );

    const row = screen.getByText('username').closest('.attribute-row');
    expect(row).toHaveClass('modified');
  });

  it('applies deleted styling when deleted is true', () => {
    render(
      <AttributeRowView
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        deleted={true}
        changed={false}
      />
    );

    const row = screen.getByText('username').closest('.attribute-row');
    expect(row).toHaveClass('deleted');
  });

  it('disables edit/delete buttons when deleted is true', () => {
    render(
      <AttributeRowView
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        deleted={true}
        changed={false}
      />
    );

    expect(screen.getByLabelText('Edit username')).toBeDisabled();
    expect(screen.getByLabelText('Delete username')).toBeDisabled();
  });

  it('applies deleted class to row when deleted is true', () => {
    render(
      <AttributeRowView
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        deleted={true}
        changed={false}
      />
    );

    const row = screen.getByText('username').closest('.attribute-row');
    expect(row).toHaveClass('deleted');
  });

  it('enables undo button when deleted is true', () => {
    jest.spyOn(mockAttribute, 'canUndo', 'get').mockReturnValue(true);
    
    render(
      <AttributeRowView
        model={mockAttribute}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        onRedo={mockOnRedo}
        deleted={true}
        changed={false}
      />
    );

    expect(screen.getByLabelText('Undo delete username')).toBeEnabled();
  });
});
