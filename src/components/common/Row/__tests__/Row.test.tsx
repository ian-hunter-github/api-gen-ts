import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Row } from '../Row';
import { Model, ModelStatus } from '../../../../utils/Model';

interface TestData extends Record<string, unknown> {
  id: string;
  name: string;
  [key: string]: unknown;
}

describe('Row', () => {
  const testDataName = 'TheName';
  const modifiedTestDataName = `${testDataName}-modified`;
  let idCounter = 0;
  const createTestModel = (status: ModelStatus) => {

    const testData = { id: `${++idCounter}`, name: testDataName };
    const model = new Model<TestData>(
      testData,
      status,
      () => `test-id-${idCounter}`
    );
    
    if (status === ModelStatus.Deleted) {
      model.delete();
    } else if (status === ModelStatus.Modified) {
      model.update({ name: modifiedTestDataName });
    }
    
    return model;
  };

  const mockRenderCellContent = (value: TestData | null) => [
    <span key="id">{value?.id}</span>,
    <span key="name">{value?.name}</span>,
  ];

  beforeEach(() => {
    idCounter = 0;
  });

  it('renders row data correctly', () => {
    const testModel = createTestModel(ModelStatus.Modified);
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
    expect(screen.getByText('TheName-modified')).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle('background-color: var(--state-modified)');
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockEdit = jest.fn();
    const testModel = createTestModel(ModelStatus.Modified);
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
    fireEvent.click(screen.getByLabelText('Edit row'));
    expect(mockEdit).toHaveBeenCalledWith(testModel);
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockDelete = jest.fn();
    const testModel = createTestModel(ModelStatus.Modified);
    
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

    fireEvent.click(screen.getByLabelText('Delete row'));
    expect(mockDelete).toHaveBeenCalledWith(testModel);
  });

  it('disables buttons when row is deleted', () => {
    const deletedModel = createTestModel(ModelStatus.Deleted);
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

    expect(screen.getByLabelText('Edit row')).toBeDisabled();
    expect(screen.getByLabelText('Delete row')).toBeDisabled();
  });

  it('applies modified class when changed prop is true', () => {
    const testModel = createTestModel(ModelStatus.Modified);
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
    const testModel = createTestModel(ModelStatus.Modified);
    testModel.update({ name: 'updated' }); // Create history for undo
    
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
    const testModel = createTestModel(ModelStatus.Modified);
    testModel.delete(); // Sets current to null
    
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
