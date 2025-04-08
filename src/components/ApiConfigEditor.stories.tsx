import { ApiConfigEditor } from './ApiConfigEditor';
import type { Meta, StoryObj } from '@storybook/react';
import type { ApiConfig } from '../types/api.types';

const meta: Meta<typeof ApiConfigEditor> = {
  title: 'Components/ApiConfigEditor',
  component: ApiConfigEditor,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ApiConfigEditor>;

const sampleConfig: ApiConfig = {
  id: 'ecom-api',
  name: 'E-Commerce API',
  description: 'API for managing e-commerce operations',
  version: '1.0.0',
  baseUrl: '/api/v1',
  entities: [],
  security: {
    authentication: {
      type: 'jwt',
      jwt: {
        secret: 'secret-key',
        expiresIn: '1h',
        issuer: 'api-service',
        audience: 'web-app'
      }
    }
  }
};

const sampleEntities = ['Product', 'Category', 'User', 'Order'];

export const Default: Story = {
  args: {
    config: sampleConfig,
    entities: sampleEntities,
    onSave: (config) => console.log('Saved:', config)
  }
};

export const WithChanges: Story = {
  args: {
    config: {
      ...sampleConfig,
      name: 'Changed Name',
      description: 'Updated description'
    },
    entities: sampleEntities,
    onSave: (config) => console.log('Saved:', config)
  }
};
