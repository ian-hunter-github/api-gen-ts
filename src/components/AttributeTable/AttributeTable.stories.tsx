import type { Meta, StoryObj } from '@storybook/react';
import { AttributeTable } from './AttributeTable';
import type { AttributeType } from '../../types/entities/attributes';
import type { AttributeModel } from '../../types/entities/AttributeModel';

const createMockAttribute = (
  name: string,
  type: AttributeType,
  required: boolean
): AttributeModel => {
  const attr = { name, type, required };
  
  return {
    id: name,
    current: attr,
    original: attr,
    status: 'pristine',
    update: () => {},
    delete: () => {},
    restore: () => {},
    canUndo: false,
    canRedo: false,
    undo: () => {},
    redo: () => {},
    history: {
      currentIndex: 0,
      current: attr,
      canUndo: false,
      canRedo: false,
      undo: () => {},
      redo: () => {},
      update: () => {},
      updateDeleted: () => {},
      get historyLength() { return 1; }
    }
  } as unknown as AttributeModel;
};

const mockAttributes: AttributeModel[] = [
  createMockAttribute('id', 'string', true),
  createMockAttribute('name', 'string', false),
  createMockAttribute('age', 'number', false),
  createMockAttribute('isActive', 'boolean', true),
  createMockAttribute('birthDate', 'date', false),
  createMockAttribute('createdAt', 'datetime', true),
  createMockAttribute('updatedAt', 'timestamp', true),
  createMockAttribute('uuid', 'uuid', true),
  createMockAttribute('metadata', 'object', false),
  createMockAttribute('tags', 'array', false),
  createMockAttribute('userId', 'reference', true),
  createMockAttribute('status', 'enum', true)
];

const createMockAttributeWithUndo = (
  name: string,
  type: AttributeType,
  required: boolean
): AttributeModel => {
  const attr = { name, type, required };
  
  return {
    id: name,
    current: attr,
    original: attr,
    status: 'modified',
    update: () => {},
    delete: () => {},
    restore: () => {},
    canUndo: true,
    canRedo: false,
    undo: () => {},
    redo: () => {},
    history: {
      currentIndex: 0,
      current: attr,
      canUndo: true,
      canRedo: false,
      undo: () => {},
      redo: () => {},
      update: () => {},
      updateDeleted: () => {},
      get historyLength() { return 1; }
    }
  } as unknown as AttributeModel;
};

const mockAttributesWithUndo: AttributeModel[] = [
  createMockAttribute('id', 'string', true),
  createMockAttributeWithUndo('name', 'string', false),
  createMockAttribute('age', 'number', false),
  createMockAttributeWithUndo('isActive', 'boolean', true),
  createMockAttribute('birthDate', 'date', false),
  createMockAttributeWithUndo('createdAt', 'datetime', true),
  createMockAttribute('updatedAt', 'timestamp', true),
  createMockAttribute('uuid', 'uuid', true),
  createMockAttributeWithUndo('metadata', 'object', false),
  createMockAttribute('tags', 'array', false),
  createMockAttribute('userId', 'reference', true),
  createMockAttributeWithUndo('status', 'enum', true)
];

const mockAttributesWithDeleted: AttributeModel[] = [
  createMockAttribute('id', 'string', true),
  createMockAttribute('name', 'string', false),
  createMockAttributeWithUndo('age', 'number', false),
  createMockAttribute('isActive', 'boolean', true),
  createMockAttribute('birthDate', 'date', false),
  createMockAttribute('createdAt', 'datetime', true),
  createMockAttribute('updatedAt', 'timestamp', true),
  createMockAttribute('uuid', 'uuid', true),
  createMockAttribute('metadata', 'object', false),
  createMockAttributeWithUndo('tags', 'array', false),
  createMockAttribute('userId', 'reference', true),
  createMockAttribute('status', 'enum', true)
];

const meta: Meta<typeof AttributeTable> = {
  title: 'Components/AttributeTable',
  component: AttributeTable,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AttributeTable>;

export const Empty: Story = {
  args: {
    initialAttributes: [],
    onAdd: () => console.log('Add clicked'),
    onEdit: (attr: AttributeModel) => console.log('Edit clicked', attr)
  }
};

export const WithAttributes: Story = {
  args: {
    initialAttributes: mockAttributes,
    onAdd: () => console.log('Add clicked'),
    onEdit: (attr: AttributeModel) => console.log('Edit clicked', attr)
  }
};

export const WithChangedAttributes: Story = {
  args: {
    initialAttributes: mockAttributesWithUndo,
    onAdd: () => console.log('Add clicked'),
    onEdit: (attr: AttributeModel) => console.log('Edit clicked', attr)
  }
};

export const WithDeletedAttributes: Story = {
  args: {
    initialAttributes: mockAttributesWithDeleted,
    onAdd: () => console.log('Add clicked'),
    onEdit: (attr: AttributeModel) => console.log('Edit clicked', attr)
  }
};
