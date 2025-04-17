import type { Meta, StoryObj } from '@storybook/react';
import { ActionButtons } from './ActionButtons';
import { Model, ModelStatus } from '../../../utils/Model';

const meta: Meta<typeof ActionButtons> = {
  title: 'Components/ActionButtons',
  component: ActionButtons,
  tags: ['autodocs'],
  argTypes: {
    containerComponent: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActionButtons>;

const testModel = new Model({
  id: '1',
  name: 'Test Item',
  value: 100,
});

export const Basic: Story = {
  args: {
    model: testModel,
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
  },
};

export const WithUndoRedo: Story = {
  args: {
    model: testModel,
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
    onUndo: () => console.log('Undo clicked'),
    onRedo: () => console.log('Redo clicked'),
  },
};

export const DisabledButtons: Story = {
  args: {
    model: new Model({
      id: '2',
      name: 'Disabled Item',
      value: 200,
    }, ModelStatus.Deleted, () => 'test-deleted'),
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked'),
    onUndo: () => console.log('Undo clicked'),
    onRedo: () => console.log('Redo clicked'),
  },
};
