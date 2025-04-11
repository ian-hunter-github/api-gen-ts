import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ApiConfigEditor } from '../ApiConfigEditor';
import type { ApiConfig } from '../../../types/api.types';

describe('ApiConfigEditor', () => {
  const mockConfig: ApiConfig = {
    id: 'test-api',
    name: 'Test API',
    description: 'Test Description',
    version: '1.0.0',
    entities: [],
    security: {
      authentication: {
        type: 'none'
      }
    }
  };

  const mockAllConfigs = [mockConfig];

  it('renders correctly', () => {
    render(
      <ApiConfigEditor 
        config={mockConfig}
        onSave={jest.fn()}
        allConfigs={mockAllConfigs}
      />
    );

    expect(screen.getByLabelText('API Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('handles form changes', () => {
    render(
      <ApiConfigEditor 
        config={mockConfig}
        onSave={jest.fn()}
        allConfigs={mockAllConfigs}
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
        allConfigs={mockAllConfigs}
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
        allConfigs={mockAllConfigs}
      />
    );

    const nameInput = screen.getByLabelText('API Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    fireEvent.click(screen.getByText('Save Changes'));

    expect(mockSave).toHaveBeenCalledWith({
      ...mockConfig,
      name: 'New Name'
    });
  });
});
