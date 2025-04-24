import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import type { FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/Form/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      defaultValue: 'Field Label'
    }
  }
};

export default meta;

type Story = StoryObj<typeof TextInput>;

interface FormWrapperProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  rules?: RegisterOptions<T>;
}

const FormWrapper = <T extends FieldValues>({ name, label = 'Field Label', rules }: FormWrapperProps<T>) => {
  const { control, trigger } = useForm<T>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    shouldUnregister: true,
    shouldUseNativeValidation: false
  });

  // Trigger validation on initial render for all fields with rules
  React.useEffect(() => {
    if (rules) {
      trigger(name);
    }
  }, [name, rules, trigger]);

  return <TextInput name={name} control={control} label={label} rules={rules} />;
};

export const Basic: Story = {
  render: (args) => <FormWrapper {...args} name="basicField" />
};

export const RequiredField: Story = {
  render: (args) => (
    <FormWrapper 
      {...args} 
      name="requiredField" 
      rules={{ required: 'This field is required' }} 
    />
  ),
  parameters: {
    pseudo: {
      hover: true,
      focus: true,
      invalid: true
    }
  }
};

export const EmailValidation: Story = {
  render: (args) => (
    <FormWrapper
      {...args}
      name="emailField"
      rules={{
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address'
        },
        required: "Required field"
      }}
    />
  )
};

export const MinimumLength: Story = {
  render: (args) => (
    <FormWrapper
      {...args}
      name="minLengthField"
      rules={{
        minLength: {
          value: 6,
          message: 'Must be at least 6 characters'
        }
      }}
    />
  )
};

const ModifiedStateComponent = () => {
  const { control } = useForm({
    defaultValues: {
      modifiedField: 'Initial value'
    }
  });
  return <TextInput name="modifiedField" control={control} label="Modified Field" />;
};

export const ModifiedState: Story = {
  render: () => <ModifiedStateComponent />,
  parameters: {
    pseudo: {
      dirty: true
    }
  }
};

export const ErrorState: Story = {
  render: (args) => (
    <FormWrapper
      {...args}
      name="errorField"
      rules={{
        validate: () => 'This field has an error'
      }}
    />
  ),
  parameters: {
    pseudo: {
      invalid: true
    }
  }
};
