import { Meta, StoryObj } from '@storybook/react';
import { FormBuilder } from './FormBuilder';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

type SampleFormData = {
  username: string;
  email: string;
  age: number;
  bio: string;
  isAdmin: boolean;
  subscription: string;
  birthDate: string;
};

const meta: Meta<typeof FormBuilder> = {
  title: 'Components/FormBuilder',
  component: FormBuilder,
  tags: ['autodocs'],
};

export default meta;

// Simple form example
export const SimpleForm: StoryObj<typeof FormBuilder<SampleFormData>> = {
  args: {
    initialValues: {
      username: '',
      email: '',
      age: 0,
      bio: '',
      isAdmin: false,
      subscription: 'free',
      birthDate: ''
    },
    onSubmit: (data) => console.log('Form submitted:', data),
    fields: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        placeholder: 'Enter your username'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
        required: true,
        validation: {
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email'
          }
        }
      },
      {
        name: 'age',
        label: 'Age',
        type: 'number',
        validation: {
          min: 18,
          max: 120
        }
      },
      {
        name: 'bio',
        label: 'Biography',
        type: 'textarea',
        rows: 4
      },
      {
        name: 'isAdmin',
        label: 'Admin privileges',
        type: 'boolean'
      },
      {
        name: 'subscription',
        label: 'Subscription',
        type: 'select',
        options: [
          { value: 'free', label: 'Free' },
          { value: 'pro', label: 'Pro' },
          { value: 'enterprise', label: 'Enterprise' }
        ]
      }
    ]
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test validation
    await userEvent.type(canvas.getByLabelText('Email'), 'invalid-email');
    await userEvent.click(canvas.getByRole('button', { name: /submit/i }));
    await expect(canvas.getByText('Please enter a valid email')).toBeInTheDocument();
  }
};

// Complex form example with all field types
export const ComplexForm: StoryObj<typeof FormBuilder<SampleFormData>> = {
  args: {
    initialValues: {
      username: 'johndoe',
      email: 'john@example.com',
      age: 30,
      bio: 'Software developer',
      isAdmin: true,
      subscription: 'pro',
      birthDate: '1990-01-01'
    },
    onSubmit: (data) => console.log('Form submitted:', data),
    fields: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        validation: {
          min: { value: 3, message: 'Must be at least 3 characters' }
        }
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
        required: true
      },
      {
        name: 'age',
        label: 'Age',
        type: 'number',
        validation: {
          min: 18,
          max: 120
        }
      },
      {
        name: 'bio',
        label: 'Biography',
        type: 'textarea',
        rows: 5
      },
      {
        name: 'isAdmin',
        label: 'Admin privileges',
        type: 'boolean'
      },
      {
        name: 'subscription',
        label: 'Subscription',
        type: 'select',
        options: [
          { value: 'free', label: 'Free' },
          { value: 'pro', label: 'Pro' },
          { value: 'enterprise', label: 'Enterprise' }
        ]
      },
      {
        name: 'birthDate',
        label: 'Birth Date',
        type: 'date'
      }
    ]
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test prefilled values
    await expect(canvas.getByLabelText('Username')).toHaveValue('johndoe');
    await expect(canvas.getByLabelText('Admin privileges')).toBeChecked();
  }
};

// Form with validation
export const FormWithValidation: StoryObj<typeof FormBuilder<SampleFormData>> = {
  args: {
    initialValues: {
      username: '',
      email: '',
      age: 0,
      bio: '',
      isAdmin: false,
      subscription: 'free',
      birthDate: ''
    },
    onSubmit: (data) => console.log('Form submitted:', data),
    fields: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        validation: {
          min: { value: 3, message: 'Must be at least 3 characters' },
          max: { value: 20, message: 'Must be less than 20 characters' },
          validate: (value: unknown) => typeof value === 'string' && !value.includes('admin') || 'Username cannot contain "admin"'
        }
      },
      {
        name: 'age',
        label: 'Age',
        type: 'number',
        required: true,
        validation: {
          min: { value: 18, message: 'Must be at least 18' },
          max: { value: 120, message: 'Must be less than 120' }
        }
      }
    ]
  }
};
