import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { SelectInput } from './SelectInput';

const meta: Meta<typeof SelectInput> = {
  title: 'Components/Form/SelectInput',
  component: SelectInput,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    options: { control: 'object' },
  },
};

export default meta;
type Story = StoryObj<typeof SelectInput>;

const Template: Story['render'] = (args) => {
  const { control } = useForm();
  return <SelectInput {...args} control={control} />;
};

export const Default = {
  render: Template,
  args: {
    name: 'country',
    label: 'Country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'uk', label: 'United Kingdom' },
    ],
  },
};

export const WithError = {
  render: Template,
  args: {
    name: 'country',
    label: 'Country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'uk', label: 'United Kingdom' },
    ],
    rules: { required: 'Please select a country' },
  },
};
