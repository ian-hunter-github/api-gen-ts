import { Meta, StoryObj } from '@storybook/react';
import { AttributesTable } from './AttributesTable';
import { AttributeModel } from '../types/entities/attributes';

const meta: Meta<typeof AttributesTable> = {
  title: 'Components/AttributesTable',
  component: AttributesTable,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AttributesTable>;

const mockAttributes: AttributeModel[] = [
  new AttributeModel({
    name: 'id',
    type: 'string',
    required: true,
  }),
  new AttributeModel({
    name: 'name',
    type: 'string',
    required: true,
  }),
  new AttributeModel({
    name: 'description',
    type: 'string',
    required: false,
  }),
  new AttributeModel({
    name: 'price',
    type: 'number',
    required: true,
  }),
];

export const Default: Story = {
  args: {
    attributes: mockAttributes,
    onAdd: () => console.log('Add clicked'),
    onEdit: (attr) => console.log('Edit clicked', attr),
    onDelete: (name) => console.log('Delete clicked', name),
    onUndoDelete: (name) => console.log('Undo delete clicked', name),
    changedAttributes: new Set(),
    deletedAttributes: new Set(),
  },
};

export const WithChanges: Story = {
  args: {
    ...Default.args,
    changedAttributes: new Set(['name', 'price']),
  },
};

export const WithDeletions: Story = {
  args: {
    ...Default.args,
    deletedAttributes: new Set(['description']),
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    attributes: [],
  },
};
