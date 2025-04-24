import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { TextArea } from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Components/Form/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof TextArea>;

const Template: Story['render'] = (args) => {
  const { control } = useForm();
  return <TextArea {...args} control={control} />;
};

export const Default = {
  render: Template,
  args: {
    name: 'description',
    label: 'Description',
  },
};

export const WithError = {
  render: Template,
  args: {
    name: 'description',
    label: 'Description',
    rules: { required: 'Description is required' },
  },
};
