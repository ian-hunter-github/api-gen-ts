import { useApiConfigStore } from '../apiConfigStore';
import { ApiConfig } from '../../types/api.types';

describe('apiConfigStore schema validation', () => {
  it('should validate complex config schema', () => {
    const complexConfig: ApiConfig = {
      id: 'test',
      name: 'Test API',
      description: 'Test API Description',
      version: '1.0.0',
      entities: [
        {
          name: 'User',
          description: 'User entity',
          attributes: [
            {
              id: '1',
              name: 'username',
              type: 'string',
              description: 'Username attribute'
            }
          ]
        }
      ],
      security: {
        authentication: {
          type: 'jwt',
          jwt: {
            secret: 'secret',
            expiresIn: '1h'
          }
        },
        authorization: {
          roles: [
            {
              name: 'admin',
              description: 'Admin role',
              permissions: ['read', 'write']
            }
          ]
        }
      },
      deployment: [
        {
          provider: 'aws',
          settings: {
            region: 'us-east-1',
            apiGateway: true
          }
        }
      ],
      datasource: {
        type: 'postgres',
        connection: {
          host: 'localhost',
          port: 5432,
          username: 'user',
          password: 'pass',
          database: 'db'
        }
      },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };

    const apiId = useApiConfigStore.getState().addApi(complexConfig);
    expect(apiId).toBeDefined();
  });
});
