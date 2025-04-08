import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ApiConfigEditor } from '../ApiConfigEditor';
import type { ApiConfig } from '../../types/api.types';

describe('ApiConfigEditor', () => {
  const mockConfig: ApiConfig = {
    name: 'Test API',
    description: 'Test description',
    version: '1.0.0'
  };

  const mockEntities = ['User', 'Product'];

  it('renders correctly', () => {
    render(
      <ApiConfigEditor 
        config={mockConfig}
        onSave={jest.fn()}
        entities={mockEntities}
      />
    );

    expect(screen.getByLabelText('API Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Product')).toBeInTheDocument();
  });

  it('handles form changes', () => {
    render(
      <ApiConfigEditor 
        config={mockConfig}
        onSave={jest.fn()}
        entities={mockEntities}
      />
    );

    const nameInput = screen.getByLabelText('API Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(nameInput).toHaveValue('New Name');
  });

  it('highlights changed fields', () => {
    render(
      <ApiConfigEditor 
        config={mockConfig}
        onSave={jest.fn()}
        entities={mockEntities}
      />
    );

    const nameInput = screen.getByLabelText('API Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(nameInput.closest('.form-group')).toHaveClass('changed');
  });

  it('calls onSave with updated config', () => {
    const mockSave = jest.fn();
    render(
      <ApiConfigEditor 
        config={mockConfig}
        onSave={mockSave}
        entities={mockEntities}
      />
    );

    const nameInput = screen.getByLabelText('API Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    fireEvent.click(screen.getByText('Save'));

    expect(mockSave).toHaveBeenCalledWith({
      ...mockConfig,
      name: 'New Name'
    });
  });
});
