import { ApiConfigEditor } from './ApiConfigEditor';
import type { Meta, StoryObj } from '@storybook/react';
import type { ApiConfig } from '../../types.ORIG/api.types';

const meta: Meta<typeof ApiConfigEditor> = {
  title: 'Components/ApiConfigEditor',
  component: ApiConfigEditor,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ApiConfigEditor>;

const sampleConfig: ApiConfig = {
  id: 'test-api',
  name: 'Test API',
  description: 'Test Description',
  version: '1.0.0',
  entities: [],
  security: {
    authentication: {
      type: 'jwt',
      jwt: {
        secret: 'test-secret',
        expiresIn: '1h',
        issuer: 'test-issuer',
        audience: 'test-audience'
      }
    },
    authorization: {
      roles: [
        {
          name: 'admin',
          description: 'Administrator role',
          permissions: ['*']
        }
      ],
      policies: []
    }
  },
  endpoints: {
    baseUrl: 'https://api.example.com',
    paths: {
      '/users': {
        path: '/users',
        method: 'get',
        description: 'Returns a list of all users',
        responses: {
          '200': {
            description: 'Successful operation',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          }
        }
      }
    }
  },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z'
};

export const Default: Story = {
  args: {
    config: sampleConfig,
    onSave: (config) => console.log('Saved:', config)
  }
};
