import { describe, it, expect, beforeEach } from '@jest/globals';
import { useApiConfigStore } from '../apiConfigStore';

describe('apiConfigStore - Entity Attribute Operations', () => {
  beforeEach(() => {
    useApiConfigStore.setState({ apis: {} });
  });

  const getStore = () => useApiConfigStore.getState();

  it('should create API with basic attributes', () => {
    const apiId = getStore().addApi({
      name: 'Test API',
      version: '1.0.0',
      security: {
        authentication: {
          type: 'jwt',
          jwt: {
            secret: 'test-secret',
            expiresIn: '1h'
          }
        },
        authorization: {
          roles: [{
            name: 'admin',
            description: 'Administrator role',
            permissions: ['*']
          }, {
            name: 'user',
            description: 'Standard user role',
            permissions: ['read']
          }]
        }
      },
      entities: [
        {
          name: 'User',
          attributes: [
            { name: 'id', type: 'uuid', required: true },
            { name: 'name', type: 'string' },
            { name: 'age', type: 'number' },
            { name: 'isActive', type: 'boolean' },
            { name: 'createdAt', type: 'datetime' }
          ]
        }
      ]
    });

    const api = getStore().getApi(apiId);
    expect(api).toBeDefined();
    expect(api?.entities[0].attributes).toEqual([
      { name: 'id', type: 'uuid', required: true },
      { name: 'name', type: 'string' },
      { name: 'age', type: 'number' },
      { name: 'isActive', type: 'boolean' },
      { name: 'createdAt', type: 'datetime' },
    ]);
  });

  it('should handle array attributes', () => {
    const apiId = getStore().addApi({
      name: 'Test API',
      version: '1.0.0',
      security: {
        authentication: {
          type: 'jwt',
          jwt: {
            secret: 'test-secret',
            expiresIn: '1h'
          }
        },
        authorization: {
          roles: [{
            name: 'admin',
            description: 'Administrator role',
            permissions: ['*']
          }, {
            name: 'user',
            description: 'Standard user role',
            permissions: ['read']
          }]
        }
      },
      entities: [
        {
          name: 'User',
          attributes: [
            { 
              name: 'tags',
              type: 'array',
              items: {
                name: 'tag',
                type: 'string'
              }
            }
          ]
        }
      ]
    });

    const api = getStore().getApi(apiId);
    expect(api).toBeDefined();
    expect(api?.entities[0].attributes).toEqual([
      { 
        name: 'tags',
        type: 'array',
        items: {
          name: 'tag',
          type: 'string'
        }
      }
    ]);
  });

  it('should handle complex attribute scenarios', () => {
    const apiId = getStore().addApi({
      name: 'Test API',
      version: '1.0.0',
      security: {
        authentication: {
          type: 'jwt',
          jwt: {
            secret: 'test-secret',
            expiresIn: '1h'
          }
        },
        authorization: {
          roles: [{
            name: 'admin',
            description: 'Administrator role',
            permissions: ['*']
          }, {
            name: 'user',
            description: 'Standard user role',
            permissions: ['read']
          }]
        }
      },
      entities: [
        {
          name: 'User',
          attributes: [
            { name: 'id', type: 'uuid', required: true },
            { 
              name: 'profile', 
              type: 'object',
              items: {
                name: 'profile',
                type: 'object'
              }
            },
            { 
              name: 'addresses',
              type: 'array',
              items: {
                name: 'address',
                type: 'string'
              }
            }
          ]
        }
      ]
    });

    const api = getStore().getApi(apiId);
    expect(api).toBeDefined();
    expect(api?.entities[0].attributes).toEqual([
      { name: 'id', type: 'uuid', required: true },
      { 
        name: 'profile',
        type: 'object',
        items: {
          name: 'profile',
          type: 'object'
        }
      },
      { 
        name: 'addresses',
        type: 'array',
        items: {
          name: 'address',
          type: 'string'
        }
      }
    ]);
  });
});
