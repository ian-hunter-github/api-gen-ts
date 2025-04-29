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
    { id: 'attr-id-string', name: 'id', type: 'string', required: true },
    { id: 'attr-createdAt-date', name: 'createdAt', type: 'date', required: false }
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
        { id: 'attr-id-string', name: 'id', type: 'string', required: true },
        { id: 'attr-name-string', name: 'name', type: 'string', required: true },
        { id: 'attr-email-string', name: 'email', type: 'string', required: true },
        { id: 'attr-age-number', name: 'age', type: 'number', required: false },
        { id: 'attr-createdAt-date', name: 'createdAt', type: 'date', required: false },
        { id: 'attr-updatedAt-date', name: 'updatedAt', type: 'date', required: false },
        { id: 'attr-isActive-boolean', name: 'isActive', type: 'boolean', required: false },
        { id: 'attr-address-string', name: 'address', type: 'string', required: false },
        { id: 'attr-phone-string', name: 'phone', type: 'string', required: false },
        { id: 'attr-birthDate-date', name: 'birthDate', type: 'date', required: false },
        { id: 'attr-gender-string', name: 'gender', type: 'string', required: false },
        { id: 'attr-salary-number', name: 'salary', type: 'number', required: false },
        { id: 'attr-department-string', name: 'department', type: 'string', required: true },
        { id: 'attr-position-string', name: 'position', type: 'string', required: true },
        { id: 'attr-startDate-date', name: 'startDate', type: 'date', required: true },
        { id: 'attr-endDate-date', name: 'endDate', type: 'date', required: false },
        { id: 'attr-manager-string', name: 'manager', type: 'string', required: false },
        { id: 'attr-status-string', name: 'status', type: 'string', required: true },
        { id: 'attr-notes-string', name: 'notes', type: 'string', required: false },
        { id: 'attr-avatar-string', name: 'avatar', type: 'string', required: false }
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
