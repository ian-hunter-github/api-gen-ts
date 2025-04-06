import { EntityDialog } from './EntityDialog';
import type { Meta, StoryObj } from '@storybook/react';
import type { ApiEntity } from '../types/entities/entity';

const meta: Meta<typeof EntityDialog> = {
  title: 'Components/EntityDialog',
  component: EntityDialog,
  tags: ['autodocs'],
  argTypes: {
    onSave: { action: 'saved' },
    onCancel: { action: 'cancelled' }
  }
};

export default meta;

type Story = StoryObj<typeof EntityDialog>;

const mockEntity: ApiEntity = {
  name: 'TestEntity',
  description: 'Test description',
  attributes: [
    { name: 'id', type: 'string', required: true },
    { name: 'createdAt', type: 'date', required: false }
  ]
};

const emptyEntity: ApiEntity = {
  name: '',
  description: '',
  attributes: []
};

export const CreateMode: Story = {
  args: {
    entity: emptyEntity
  }
};

export const EditMode: Story = {
  args: {
    entity: mockEntity
  }
};

export const WithManyAttributes: Story = {
  args: {
    entity: {
      ...mockEntity,
      attributes: [
        { name: 'id', type: 'string', required: true },
        { name: 'name', type: 'string', required: true },
        { name: 'email', type: 'string', required: true },
        { name: 'age', type: 'number', required: false },
        { name: 'createdAt', type: 'date', required: false },
        { name: 'updatedAt', type: 'date', required: false },
        { name: 'isActive', type: 'boolean', required: false }
      ]
    }
  }
};
