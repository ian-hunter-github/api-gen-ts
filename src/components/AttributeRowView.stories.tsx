import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { AttributeRowView } from './AttributeRowView';
import { AttributeModel, EntityAttribute, AttributeType } from '../types/entities/attributes';

export default {
  title: 'Components/AttributeRowView',
  component: AttributeRowView,
} as Meta;

const Template: StoryFn<typeof AttributeRowView> = (args) => (
  <table>
    <tbody>
      <AttributeRowView {...args} />
    </tbody>
  </table>
);

const baseAttribute: EntityAttribute = {
  name: 'test',
  type: 'string' as AttributeType,
  required: true
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

export const Modified = Template.bind({});
Modified.args = {
  model: new AttributeModel(baseAttribute, 'modified'),
  ...baseHandlers
};

export const New = Template.bind({});
New.args = {
  model: new AttributeModel(baseAttribute, 'new'),
  ...baseHandlers
};

export const Deleted = Template.bind({});
Deleted.args = {
  model: (() => {
    const model = new AttributeModel(baseAttribute);
    model.delete();
    return model;
  })(),
  ...baseHandlers
};

export const WithUndoRedo = Template.bind({});
WithUndoRedo.args = {
  model: (() => {
    const model = new AttributeModel(baseAttribute);
    model.update({ required: false });
    model.update({ description: 'test' });
    return model;
  })(),
  ...baseHandlers
};
