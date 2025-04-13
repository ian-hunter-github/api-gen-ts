import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Row } from '../Row';
import { History } from '../../../../utils/History';

interface TestData {
  id: string;
  name: string;
}

describe('Row', () => {
  const createTestModel = (status: 'pristine' | 'modified' | 'deleted' | 'new') => {
    const history = new History<TestData>({ id: '1', name: 'Test Item' });
    
    jest.spyOn(history, 'update').mockImplementation();
    jest.spyOn(history, 'updateDeleted').mockImplementation();
    jest.spyOn(history, 'undo').mockImplementation();
    jest.spyOn(history, 'redo').mockImplementation();

    const model = {
      id: '1',
      original: status === 'pristine' ? { id: '1', name: 'Test Item' } : undefined,
      status,
      history: history,
      get current() { return history.current || null; },
      get previous() { return history.previous || null; },
      get canUndo() { return Boolean(history.canUndo); },
      get canRedo() { return Boolean(history.canRedo); },
      update: history.update,
      delete: history.updateDeleted,
      restore: jest.fn(),
      undo: () => {
        const result = history.undo();
        return result !== null;
      },
      redo: () => {
        const result = history.redo();
        return result !== null;
      },
    };
    return model;
  };

  const mockRenderCellContent = (value: TestData | null) => [
    <span key="id">{value?.id}</span>,
    <span key="name">{value?.name}</span>,
  ];

  it('renders row data correctly', () => {
    const testModel = createTestModel('modified');
    const { container } = render(
      <Row
        model={testModel}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onUndo={jest.fn()}
        onRedo={jest.fn()}
        renderCellContent={mockRenderCellContent}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle('background-color: var(--state-modified)');
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockEdit = jest.fn();
    const testModel = createTestModel('modified');
    const { container } = render(
      <Row
        model={testModel}
        onEdit={mockEdit}
        onDelete={jest.fn()}
        onUndo={jest.fn()}
        onRedo={jest.fn()}
        renderCellContent={mockRenderCellContent}
      />
    );

    expect(container.firstChild).toHaveStyle('background-color: var(--state-modified)');
    fireEvent.click(screen.getByLabelText('Edit Test Item'));
    expect(mockEdit).toHaveBeenCalledWith(testModel);
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockDelete = jest.fn();
    const testModel = createTestModel('modified');
    
    render(
      <Row
        model={testModel}
        onEdit={jest.fn()}
        onDelete={mockDelete}
        onUndo={jest.fn()}
        onRedo={jest.fn()}
        renderCellContent={mockRenderCellContent}
      />
    );

    fireEvent.click(screen.getByLabelText('Delete Test Item'));
    expect(mockDelete).toHaveBeenCalledWith(testModel);
  });

  it('disables buttons when row is deleted', () => {
    const deletedModel = createTestModel('deleted');
    render(
      <Row
        model={deletedModel}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onUndo={jest.fn()}
        onRedo={jest.fn()}
        renderCellContent={mockRenderCellContent}
      />
    );

    expect(screen.getByLabelText('Edit Test Item')).toBeDisabled();
    expect(screen.getByLabelText('Delete Test Item')).toBeDisabled();
  });

  it('applies modified class when changed prop is true', () => {
    const testModel = createTestModel('modified');
    const { container } = render(
      <Row
        model={testModel}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onUndo={jest.fn()}
        onRedo={jest.fn()}
        renderCellContent={mockRenderCellContent}
      />
    );

    expect(container.firstChild).toHaveClass('modified');
  });

  it('handles undo/redo button states based on model.canUndo/canRedo', () => {
    const testModel = {
      ...createTestModel('modified'),
      get canUndo() { return true; },
      get canRedo() { return false; }
    };

    render(
      <Row
        model={testModel}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onUndo={jest.fn()}
        onRedo={jest.fn()}
        renderCellContent={mockRenderCellContent}
      />
    );

    expect(screen.getByLabelText('Undo row')).toBeEnabled();
    expect(screen.getByLabelText('Redo row')).toBeDisabled();
  });

  it('handles empty/null current value gracefully', () => {
    const testModel = {
      ...createTestModel('modified'),
      get current() { return null; }
    };

    render(
      <Row
        model={testModel}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onUndo={jest.fn()}
        onRedo={jest.fn()}
        renderCellContent={() => [<span key="empty">Empty</span>]}
      />
    );

    expect(screen.getByText('Empty')).toBeInTheDocument();
  });
});
