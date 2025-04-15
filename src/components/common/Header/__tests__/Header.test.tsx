import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../Header';
import { Model, ModelStatus } from '../../../../utils/Model';

interface TestData extends Record<string, unknown> {
  id: string;
  name: string;
  [key: string]: unknown;
}

describe('Header', () => {
  const testDataName = 'TheName';
  let idCounter = 0;

  const createTestModel = (status: ModelStatus) => {

    const testData = { id: `${++idCounter}`, name: testDataName };
    const model = new Model<TestData>(
      testData,
      status,
      () => `test-id-${idCounter}`,
      false, // isNew
    );
    
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
   render(
      <Header
        model={testModel}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onUndo={jest.fn()}
        onRedo={jest.fn()}
        renderCellContent={mockRenderCellContent}
      />
    );

    expect(screen.getByText('TheName')).toBeInTheDocument();

  });


});
