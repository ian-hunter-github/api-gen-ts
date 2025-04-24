import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { CheckboxInput } from './CheckboxInput';

const meta: Meta<typeof CheckboxInput> = {
  title: 'Components/Form/CheckboxInput',
  component: CheckboxInput,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxInput>;

const Template: Story['render'] = (args) => {
  const { control } = useForm();
  return <CheckboxInput {...args} control={control} />;
};

export const Default = {
  render: Template,
  args: {
    name: 'acceptTerms',
    label: 'I accept the terms and conditions',
  },
};

export const WithError = {
  render: Template,
  args: {
    name: 'acceptTerms',
    label: 'I accept the terms and conditions',
    rules: { required: 'You must accept the terms' },
  },
};
