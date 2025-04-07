import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AttributeList } from '../AttributeList';
import { EntityAttribute } from '../../types/entities/attributes';

describe('AttributeList', () => {
  const mockAttributes: EntityAttribute[] = [
    {
      name: 'username',
      type: 'string',
      required: true,
      description: 'User login name'
    },
    {
      name: 'age',
      type: 'number',
      required: false
    }
  ];

  const mockOnAdd = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    render(
      <AttributeList
        attributes={mockAttributes}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
  });

  it('renders the title and add button', () => {
    expect(screen.getByText('Attributes')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('renders all attributes in the table', () => {
    expect(screen.getByText('username')).toBeInTheDocument();
    expect(screen.getByText('string')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('age')).toBeInTheDocument();
    expect(screen.getByText('number')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('calls onAdd when add button is clicked', () => {
    fireEvent.click(screen.getByText('+'));
    expect(mockOnAdd).toHaveBeenCalled();
  });

  it('calls onEdit with correct attribute when edit button is clicked', () => {
    const usernameRow = screen.getByText('username').closest('tr');
    const editButton = usernameRow?.querySelector('button');
    fireEvent.click(editButton!);
    expect(mockOnEdit).toHaveBeenCalledWith(mockAttributes[0]);
  });

  it('calls onDelete with correct attribute name when delete button is clicked', () => {
    // Find and click delete button for 'age' attribute
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
    fireEvent.click(deleteButtons[0]);
    
    // Verify correct callback
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith('age');
  });
});
