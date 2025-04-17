import { Table } from './Table';
import { Model } from '../../../utils/Model';
import type { Meta, StoryObj } from '@storybook/react';

interface TestData extends Record<string, unknown> {
  id: string;
  name: string;
  value: number;
  active: boolean;
}

const testData: TestData[] = [
  { id: '1', name: 'Item 1', value: 10, active: true },
  { id: '2', name: 'Item 2', value: 20, active: false },
];

const testModels = testData.map((item) => new Model<TestData>(item));

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Basic: Story = {
  args: {
    models: testModels,
  },
};

export const WithActions: Story = {
  args: {
    models: testModels,
    onEdit: (model) => console.log('Edit:', model),
    onDelete: (model) => console.log('Delete:', model),
  },
};

export const Empty: Story = {
  args: {
    models: [],
  },
};
