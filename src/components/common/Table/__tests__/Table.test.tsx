import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Table } from '../Table';
import { Model } from '../../../../utils/Model';

interface TestData extends Record<string, unknown> {
  id: string;
  name: string;
  value: number;
}

describe('Table', () => {
  const testData: TestData[] = [
    { id: '1', name: 'Item 1', value: 10 },
    { id: '2', name: 'Item 2', value: 20 },
  ];

  const testModels = testData.map((item) => new Model<TestData>(item));

  it('renders table with headers from model keys', () => {
    render(<Table models={testModels} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('renders all model data rows', () => {
    render(<Table models={testModels} />);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('shows empty state when no models', () => {
    render(<Table models={[]} />);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders action column when action handlers provided', () => {
    const onEdit = jest.fn();
    render(<Table models={testModels} onEdit={onEdit} />);
    
    expect(screen.getAllByRole('columnheader')[2]).toBeEmptyDOMElement();
  });
});
