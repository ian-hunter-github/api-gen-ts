import { describe, it, expect, beforeEach } from '@jest/globals';
import { useApiConfigStore } from '../apiConfigStore';

describe('apiConfigStore - Entity Relationship Operations', () => {
  beforeEach(() => {
    useApiConfigStore.setState({ apis: {} });
  });

  const getStore = () => useApiConfigStore.getState();

  it('should create API with basic relationships', () => {
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
          roles: [
            {
              name: 'admin',
              description: 'Administrator role',
              permissions: ['*']
            },
            {
              name: 'user',
              description: 'Standard user role',
              permissions: ['read', 'write']
            }
          ]
        }
      },
      entities: [
        {
          name: 'User',
          attributes: [
            { id: 'id', name: 'id', type: 'uuid', required: true }
          ],
          relationships: [
            {
              name: 'posts',
              type: 'one-to-many',
              source: 'User',
              target: 'Post',
              inverse: 'author'
            }
          ]
        },
        {
          name: 'Post',
          attributes: [
            { id: 'id', name: 'id', type: 'uuid', required: true }
          ],
          relationships: [
            {
              name: 'author',
              type: 'many-to-one',
              source: 'Post',
              target: 'User',
              inverse: 'posts'
            }
          ]
        }
      ]
    });

    const api = getStore().getApi(apiId);
    expect(api).toBeDefined();
    expect(api?.entities[0].relationships).toEqual([
      { 
        name: 'posts', 
        type: 'one-to-many',
        source: 'User',
        target: 'Post',
        inverse: 'author'
      }
    ]);
    expect(api?.entities[1].relationships).toEqual([
      { 
        name: 'author', 
        type: 'many-to-one',
        source: 'Post',
        target: 'User',
        inverse: 'posts'
      }
    ]);
  });

  it('should handle many-to-many relationships', () => {
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
          roles: [
            {
              name: 'admin',
              description: 'Administrator role',
              permissions: ['*']
            },
            {
              name: 'user',
              description: 'Standard user role',
              permissions: ['read', 'write']
            }
          ]
        }
      },
      entities: [
        {
          name: 'User',
          attributes: [
            { id: 'id', name: 'id', type: 'uuid', required: true }
          ],
          relationships: [
            { 
              name: 'roles', 
              type: 'many-to-many',
              source: 'User',
              target: 'Role'
            }
          ]
        },
        {
          name: 'Role',
          attributes: [
            { id: 'id', name: 'id', type: 'uuid', required: true }
          ]
        },
        {
          name: 'UserRole',
          attributes: [
            { id: 'userId', name: 'userId', type: 'uuid', required: true },
            { id: 'roleId', name: 'roleId', type: 'uuid', required: true }
          ]
        }
      ]
    });

    const api = getStore().getApi(apiId);
    expect(api).toBeDefined();
    expect(api?.entities[0].relationships).toEqual([
      { 
        name: 'roles', 
        type: 'many-to-many',
        source: 'User',
        target: 'Role'
      }
    ]);
    expect(api?.entities[2]).toEqual({
      name: 'UserRole',
      attributes: [
        { id: 'userId', name: 'userId', type: 'uuid', required: true },
        { id: 'roleId', name: 'roleId', type: 'uuid', required: true }
      ],
      relationships: []
    });
  });

  it('should validate required relationship fields', () => {
    expect(() => {
      getStore().addApi({
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
          roles: [
            {
              name: 'admin',
              description: 'Administrator role',
              permissions: ['*']
            },
            {
              name: 'user',
              description: 'Standard user role',
              permissions: ['read', 'write']
            }
          ]
        }
      },
        entities: [
          {
            name: 'User',
            attributes: [
              { id: 'id', name: 'id', type: 'uuid', required: true }
            ],
            relationships: [
              { name: 'posts', type: 'one-to-many', source: 'User', target: 'Post' }
            ]
          }
        ]
      });
    }).toThrow('Relationship target entity "Post" does not exist');
  });
});
