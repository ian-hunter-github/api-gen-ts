import { StoryFn, Meta } from '@storybook/react';
import { AttributeRow } from './AttributeRow';
import { EntityAttribute, AttributeType } from '../../types/entities/attributes';
import { AttributeModel } from '../../types/entities/AttributeModel';

export default {
  title: 'Components/AttributeRow',
  component: AttributeRow,
} as Meta;

const Template: StoryFn<typeof AttributeRow> = (args) => (
  <table>
    <tbody>
      <AttributeRow {...args} />
    </tbody>
  </table>
);

const baseAttribute: EntityAttribute = {
  id: 'attr-test-string',
  name: 'test',
  type: 'string' as AttributeType,
  required: true
};

const dateAttribute: EntityAttribute = {
  id: 'attr-birthDate-date',
  name: 'birthDate',
  type: 'date',
  required: false
};

const datetimeAttribute: EntityAttribute = {
  id: 'attr-createdAt-datetime',
  name: 'createdAt',
  type: 'datetime',
  required: true
};

const timestampAttribute: EntityAttribute = {
  id: 'attr-updatedAt-timestamp',
  name: 'updatedAt',
  type: 'timestamp',
  required: true
};

const uuidAttribute: EntityAttribute = {
  id: 'attr-id-uuid',
  name: 'id',
  type: 'uuid',
  required: true
};

const objectAttribute: EntityAttribute = {
  id: 'attr-metadata-object',
  name: 'metadata',
  type: 'object',
  required: false
};

const arrayAttribute: EntityAttribute = {
  id: 'attr-tags-array',
  name: 'tags',
  type: 'array',
  required: false,
  items: {
    id: 'attr-tag-string',
    name: 'tag',
    type: 'string'
  }
};

const referenceAttribute: EntityAttribute = {
  id: 'attr-userId-reference',
  name: 'userId',
  type: 'reference',
  required: true
};

const enumAttribute: EntityAttribute = {
  id: 'attr-status-enum',
  name: 'status',
  type: 'enum',
  required: true,
  enumValues: ['active', 'inactive', 'pending']
};

const baseHandlers = {
  onEdit: () => {},
  onDelete: () => {},
  onUndo: () => {},
  onRedo: () => {},
  onRestore: () => {}
};

export const Pristine = Template.bind({});
Pristine.args = {
  model: new AttributeModel(baseAttribute),
  ...baseHandlers
};

export const StringType = Template.bind({});
StringType.args = {
  model: new AttributeModel(baseAttribute),
  ...baseHandlers
};

export const DateType = Template.bind({});
DateType.args = {
  model: new AttributeModel(dateAttribute),
  ...baseHandlers
};

export const DatetimeType = Template.bind({});
DatetimeType.args = {
  model: new AttributeModel(datetimeAttribute),
  ...baseHandlers
};

export const TimestampType = Template.bind({});
TimestampType.args = {
  model: new AttributeModel(timestampAttribute),
  ...baseHandlers
};

export const UuidType = Template.bind({});
UuidType.args = {
  model: new AttributeModel(uuidAttribute),
  ...baseHandlers
};

export const ObjectType = Template.bind({});
ObjectType.args = {
  model: new AttributeModel(objectAttribute),
  ...baseHandlers
};

export const ArrayType = Template.bind({});
ArrayType.args = {
  model: new AttributeModel(arrayAttribute),
  ...baseHandlers
};

export const ReferenceType = Template.bind({});
ReferenceType.args = {
  model: new AttributeModel(referenceAttribute),
  ...baseHandlers
};

export const EnumType = Template.bind({});
EnumType.args = {
  model: new AttributeModel(enumAttribute),
  ...baseHandlers
};

export const ModifiedString = Template.bind({});
ModifiedString.args = {
  model: (() => {
    const model = new AttributeModel(baseAttribute);
    model.update({ required: false });
    return model;
  })(),
  ...baseHandlers
};

export const ModifiedEnum = Template.bind({});
ModifiedEnum.args = {
  model: (() => {
    const model = new AttributeModel(enumAttribute);
    model.update({ required: false });
    return model;
  })(),
  ...baseHandlers
};

export const NewString = Template.bind({});
NewString.args = {
  model: new AttributeModel(baseAttribute, 'new'),
  ...baseHandlers
};

export const NewObject = Template.bind({});
NewObject.args = {
  model: new AttributeModel(objectAttribute, 'new'),
  ...baseHandlers
};

export const DeletedString = Template.bind({});
DeletedString.args = {
  model: (() => {
    const model = new AttributeModel(baseAttribute);
    model.update({ required: false });
    model.delete();
    return model;
  })(),
  ...baseHandlers
};

export const DeletedArray = Template.bind({});
DeletedArray.args = {
  model: (() => {
    const model = new AttributeModel(arrayAttribute);
    model.delete();
    return model;
  })(),
  ...baseHandlers
};

export const WithUndoRedoString = Template.bind({});
WithUndoRedoString.args = {
  model: (() => {
    const model = new AttributeModel(baseAttribute);
    model.update({ required: false });
    model.update({ description: 'test' });
    model.undo(); // Perform undo to create redo history
    return model;
  })(),
  ...baseHandlers
};

export const WithUndoRedoEnum = Template.bind({});
WithUndoRedoEnum.args = {
  model: (() => {
    const model = new AttributeModel(enumAttribute);
    model.update({ enumValues: ['active', 'inactive'] });
    model.undo(); // Perform undo to create redo history
    return model;
  })(),
  ...baseHandlers
};
