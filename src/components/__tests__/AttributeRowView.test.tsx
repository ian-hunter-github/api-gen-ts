import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AttributeModel, EntityAttribute } from '../../types/entities/attributes';
import { AttributeRowView } from '../AttributeRowView';

describe('AttributeRowView', () => {
  const mockAttribute: EntityAttribute = {
    name: 'test',
    type: 'string',
    required: true
  };

  const mockModel = new AttributeModel(mockAttribute);
  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onUndo: jest.fn(),
    onRedo: jest.fn(),
    onRestore: jest.fn()
  };

  it('renders attribute data', () => {
    render(<AttributeRowView model={mockModel} {...mockHandlers} />);
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('string')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    render(<AttributeRowView model={mockModel} {...mockHandlers} />);
    fireEvent.click(screen.getByLabelText('Edit test'));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockModel);
  });

  it('calls onDelete when delete button clicked', () => {
    render(<AttributeRowView model={mockModel} {...mockHandlers} />);
    fireEvent.click(screen.getByLabelText('Delete test'));
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockModel);
  });

  it('shows undo/redo buttons when available', () => {
    const model = new AttributeModel(mockAttribute);
    const { rerender } = render(<AttributeRowView model={model} {...mockHandlers} />);
    
    // Initial state - no buttons should be visible
    expect(screen.queryByLabelText('Undo changes to test')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Redo changes to test')).not.toBeInTheDocument();
    
    // First update - creates history entry
    model.update({ required: false });
    rerender(<AttributeRowView model={model} {...mockHandlers} />);
    
    // After first update - undo should be available
    expect(model.canUndo).toBe(true);
    expect(screen.getByLabelText('Undo changes to test')).toBeInTheDocument();
    expect(screen.queryByLabelText('Redo changes to test')).not.toBeInTheDocument();
    
    // Second update - creates another history entry
    model.update({ description: 'test' });
    rerender(<AttributeRowView model={model} {...mockHandlers} />);
    
    // After second update - undo still available
    expect(screen.getByLabelText('Undo changes to test')).toBeInTheDocument();
    expect(screen.queryByLabelText('Redo changes to test')).not.toBeInTheDocument();
    
    // Perform undo through handler
    mockHandlers.onUndo.mockImplementation(() => {
      model.undo();
      rerender(<AttributeRowView model={model} {...mockHandlers} />);
    });
    fireEvent.click(screen.getByLabelText('Undo changes to test'));
    
    // After undo - should show both undo and redo buttons
    expect(screen.getByLabelText('Undo changes to test')).toBeInTheDocument();
    expect(screen.getByLabelText('Redo changes to test')).toBeInTheDocument();
    
    // Perform redo through handler
    mockHandlers.onRedo.mockImplementation(() => {
      model.redo();
      rerender(<AttributeRowView model={model} {...mockHandlers} />);
    });
    fireEvent.click(screen.getByLabelText('Redo changes to test'));
    
    // After redo - should show undo button only again
    expect(screen.getByLabelText('Undo changes to test')).toBeInTheDocument();
    expect(screen.queryByLabelText('Redo changes to test')).not.toBeInTheDocument();
  });

  it('shows restore button when deleted', () => {
    const deletedModel = new AttributeModel(mockAttribute);
    deletedModel.delete();

    render(<AttributeRowView model={deletedModel} {...mockHandlers} />);
    expect(screen.getByLabelText('Restore test')).toBeInTheDocument();
  });

  it('handles null state safely by rendering default attribute', () => {
    const model = new AttributeModel(mockAttribute);
    // Force history into null state (simulating updateDeleted)
    model['history']['history'] = [null];
    model['history']['currentIndex'] = 0;
    
    render(<AttributeRowView model={model} {...mockHandlers} />);
    
    // Verify default empty attribute is rendered
    const nameCell = screen.getByTestId('attribute-name');
    expect(nameCell).toBeEmptyDOMElement(); // Empty name cell
    expect(screen.getByText('string')).toBeInTheDocument(); // Default type
    expect(screen.getByText('No')).toBeInTheDocument(); // Default required=false
  });

  it('tracks history length correctly', () => {
    const model = new AttributeModel(mockAttribute);
    expect(model['history']['historyLength']).toBe(1);
    
    model.update({ required: false });
    expect(model['history']['historyLength']).toBe(2);
    
    model.undo();
    expect(model['history']['historyLength']).toBe(2); // Length shouldn't change on undo
  });

  it('applies correct class for status', () => {
    const modifiedModel = new AttributeModel(mockAttribute, 'modified');
    const { container } = render(<AttributeRowView model={modifiedModel} {...mockHandlers} />);
    expect(container.querySelector('tr')).toHaveClass('modified');
  });
});
