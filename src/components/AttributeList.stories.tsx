import React from 'react'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { StoryObj, Meta } from '@storybook/react';
import { AttributeList } from './AttributeList';
import { EntityAttribute } from '../types/entities/attributes';

const meta: Meta<typeof AttributeList> = {
  title: 'Components/AttributeList',
  component: AttributeList,
  argTypes: {
    onAdd: { action: 'add clicked' },
    onEdit: { action: 'edit clicked' },
    onDelete: { action: 'delete clicked' }
  }
};
export default meta;

type Story = StoryObj<typeof AttributeList>;

const mockAttributes: EntityAttribute[] = [
  {
    name: 'username',
    type: 'string',
    required: true,
    description: 'User login name'
  },
  {
    name: 'age',
    type: 'number',
    required: false
  },
  {
    name: 'email',
    type: 'string',
    required: true
  }
];

export const Empty: Story = {
  args: {
    attributes: []
  }
};

export const WithAttributes: Story = {
  args: {
    attributes: mockAttributes
  }
};

export const ManyAttributes: Story = {
  args: {
    attributes: [...mockAttributes, ...mockAttributes, ...mockAttributes]
  }
};
