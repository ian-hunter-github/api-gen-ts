import { useState } from 'react';
import { Button } from '@mui/material';
import { EntityDialog } from './EntityDialog';
import type { Meta, StoryObj } from '@storybook/react';
import type { ApiEntity } from '../../types/entities/entity';

const meta: Meta<typeof EntityDialog> = {
  title: 'Components/EntityDialog',
  component: EntityDialog,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    onSave: { action: 'saved' },
    onCancel: { action: 'cancelled' },
    onClose: { action: 'closed' }
  },
  args: {
    open: true
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
    entity: emptyEntity,
    open: true
  }
};

export const EditMode: Story = {
  args: {
    entity: mockEntity,
    open: true
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
        { name: 'isActive', type: 'boolean', required: false },
        { name: 'address', type: 'string', required: false },
        { name: 'phone', type: 'string', required: false },
        { name: 'birthDate', type: 'date', required: false },
        { name: 'gender', type: 'string', required: false },
        { name: 'salary', type: 'number', required: false },
        { name: 'department', type: 'string', required: true },
        { name: 'position', type: 'string', required: true },
        { name: 'startDate', type: 'date', required: true },
        { name: 'endDate', type: 'date', required: false },
        { name: 'manager', type: 'string', required: false },
        { name: 'status', type: 'string', required: true },
        { name: 'notes', type: 'string', required: false },
        { name: 'avatar', type: 'string', required: false }
      ]
    },
    open: true
  }
};

const Template: Story['render'] = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button variant="contained" onClick={() => setIsOpen(true)}>
        Open Entity Dialog
      </Button>
      <EntityDialog
        {...args}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
};

export const WithModalControls: Story = {
  render: Template,
  args: {
    entity: mockEntity
  }
};
