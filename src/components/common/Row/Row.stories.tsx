import { Meta, StoryObj } from '@storybook/react';
import { Row } from './Row';
import { Model } from '../../../utils/Model';
import '../../../index.css';
import '../../../App.css';
import './Row.css';

type SampleData = {
  id: string;
  name: string;
  value: number;
  active: boolean;
};

const sampleData: SampleData = {
  id: '123',
  name: 'Sample Item',
  value: 42,
  active: true
};

const renderCellContent = (value: SampleData | null) => [
  value?.id ?? 'N/A',
  value?.name ?? 'N/A',
  value?.value.toString() ?? 'N/A',
  value?.active ? 'Active' : 'Inactive'
];

const meta: Meta<typeof Row<SampleData>> = {
  title: 'Components/Common/Row',
  component: Row,
  tags: ['autodocs'],
  argTypes: {
    model: { control: false },
    onEdit: { action: 'edit' },
    onDelete: { action: 'delete' },
    onUndo: { action: 'undo' },
    onRedo: { action: 'redo' },
    renderCellContent: { control: false }
  }
};

export default meta;

type Story = StoryObj<typeof Row<SampleData>>;

export const Default: Story = {
  args: {
    model: new Model(sampleData),

    renderCellContent
  }
};

export const Modified: Story = {
  args: {
    model: (() => {
      const model = new Model(sampleData);
      model.update({ ...sampleData, value: 99, name: 'Modified Item' });
      return model;
    })(),

    renderCellContent
  }
};

export const Deleted: Story = {
  args: {
    model: (() => {
      const model = new Model(sampleData);
      model.delete();
      return model;
    })(),

    renderCellContent
  }
};

export const WithHistory: Story = {
  args: {
    model: (() => {
      const model = new Model(sampleData);
      model.update({ ...sampleData, value: 100 });
      model.update({ ...sampleData, value: 200 });
      model.undo();
      return model;
    })(),

    renderCellContent
  }
};

export const Empty: Story = {
  args: {
    model: new Model<SampleData>({
      id: '',
      name: '',
      value: 0,
      active: false
    }),

    renderCellContent
  }
};
