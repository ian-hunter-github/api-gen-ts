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
            { id: 'id', name: 'id', type: 'uuid', required: true },
            { id: 'name', name: 'name', type: 'string' },
            { id: 'age', name: 'age', type: 'number' },
            { id: 'isActive', name: 'isActive', type: 'boolean' },
            { id: 'createdAt', name: 'createdAt', type: 'datetime' }
          ]
        }
      ]
    });

    const api = getStore().getApi(apiId);
    expect(api).toBeDefined();
    expect(api?.entities[0].attributes).toEqual([
      { id: 'id', name: 'id', type: 'uuid', required: true },
      { id: 'name', name: 'name', type: 'string' },
      { id: 'age', name: 'age', type: 'number' },
      { id: 'isActive', name: 'isActive', type: 'boolean' },
      { id: 'createdAt', name: 'createdAt', type: 'datetime' },
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
              id: 'tags',
              name: 'tags',
              type: 'array',
              items: {
                id: 'tag',
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
        id: 'tags',
        name: 'tags',
        type: 'array',
        items: {
          id: 'tag',
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
            { id: 'id', name: 'id', type: 'uuid', required: true },
            { 
              id: 'profile',
              name: 'profile', 
              type: 'object',
              items: {
                id: 'profile',
                name: 'profile',
                type: 'object'
              }
            },
            { 
              id: 'addresses',
              name: 'addresses',
              type: 'array',
              items: {
                id: 'address',
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
      { id: 'id', name: 'id', type: 'uuid', required: true },
      { 
        id: 'profile',
        name: 'profile',
        type: 'object',
        items: {
          id: 'profile',
          name: 'profile',
          type: 'object'
        }
      },
      { 
        id: 'addresses',
        name: 'addresses',
        type: 'array',
        items: {
          id: 'address',
          name: 'address',
          type: 'string'
        }
      }
    ]);
  });
});
