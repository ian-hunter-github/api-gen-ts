import { describe, it, expect, beforeEach } from '@jest/globals';
import { useApiConfigStore } from '../apiConfigStore';

describe('apiConfigStore - Endpoint Operations', () => {
  beforeEach(() => {
    useApiConfigStore.setState({ apis: {} });
  });

  const getStore = () => useApiConfigStore.getState();

  it('should create API with basic endpoints', () => {
    const apiId = getStore().addApi({
      name: 'Test API',
      description: 'Test API for endpoint operations',
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
              permissions: ['read']
            }
          ]
        }
      },
      entities: [
        {
          name: 'User',
          attributes: [
            { id: 'id', name: 'id', type: 'uuid', required: true },
            { id: 'name', name: 'name', type: 'string' }
          ],
          endpoints: [
            {
              path: '/users',
              method: 'GET',
              description: 'Get all users',
              responses: {
                '200': {
                  description: 'Successful response',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/User'
                        }
                      }
                    }
                  }
                }
              }
            }
          ]
        }
      ]
    });

    const api = getStore().getApi(apiId);
    expect(api).toBeDefined();
    expect(api?.entities[0].endpoints).toEqual([
      {
        path: '/users',
        method: 'GET',
        description: 'Get all users',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            }
          }
        }
      }
    ]);
  });

  it('should handle endpoint with parameters', () => {
    const apiId = getStore().addApi({
      name: 'Test API',
      description: 'Test API for endpoint operations',
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
              permissions: ['read']
            }
          ]
        }
      },
      entities: [
        {
          name: 'User',
          attributes: [
            { id: 'id', name: 'id', type: 'uuid', required: true },
            { id: 'name', name: 'name', type: 'string' }
          ],
          endpoints: [
            {
              path: '/users/{id}',
              method: 'GET',
              parameters: [
                {
                  name: 'id',
                  in: 'path' as const,
                  required: true,
                  schema: {
                    type: 'string',
                    format: 'uuid'
                  }
                }
              ],
              responses: {
                '200': {
                  description: 'Successful response',
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
          ]
        }
      ]
    });

    const api = getStore().getApi(apiId);
    expect(api).toBeDefined();
    expect(api?.entities[0].endpoints?.[0].parameters).toEqual([
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
          format: 'uuid'
        }
      }
    ]);
  });

  it('should handle endpoint with request body', () => {
    const apiId = getStore().addApi({
      name: 'Test API',
      description: 'Test API for endpoint operations',
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
              permissions: ['read']
            }
          ]
        }
      },
      entities: [
        {
          name: 'User',
          attributes: [
            { id: 'id', name: 'id', type: 'uuid', required: true },
            { id: 'name', name: 'name', type: 'string' }
          ],
          endpoints: [
            {
              path: '/users',
              method: 'POST',
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/User'
                    }
                  }
                }
              },
              responses: {
                '201': {
                  description: 'User created',
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
          ]
        }
      ]
    });

    const api = getStore().getApi(apiId);
    expect(api).toBeDefined();
    expect(api?.entities[0].endpoints?.[0].requestBody).toEqual({
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/User'
          }
        }
      }
    });
  });

  it('should update existing endpoint', () => {
    const apiId = getStore().addApi({
      name: 'Test API',
      description: 'Test API for endpoint operations',
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
              permissions: ['read']
            }
          ]
        }
      },
      entities: [
        {
          name: 'User',
          attributes: [
            { id: 'id', name: 'id', type: 'uuid', required: true },
            { id: 'name', name: 'name', type: 'string' }
          ],
          endpoints: [
            {
              path: '/users',
              method: 'GET',
              responses: {
                '200': {
                  description: 'Successful response'
                }
              }
            }
          ]
        }
      ]
    });

    // Update the endpoint
    const api = getStore().getApi(apiId);
    if (!api) throw new Error('API not found');

    const updatedEntities = api.entities.map(entity => ({
      ...entity,
      endpoints: entity.endpoints?.map(ep => 
        ep.path === '/users' && ep.method === 'GET' 
          ? { 
              ...ep, 
              description: 'Get all users with pagination',
              parameters: [
                {
                  name: 'page',
                  in: 'query' as const,
                  schema: { type: 'number' }
                },
                {
                  name: 'limit',
                  in: 'query' as const,
                  schema: { type: 'number' }
                }
              ]
            }
          : ep
      )
    }));

    getStore().updateApi(apiId, { entities: updatedEntities });

    const updatedApi = getStore().getApi(apiId);
    expect(updatedApi?.entities[0].endpoints?.[0].description).toBe('Get all users with pagination');
    expect(updatedApi?.entities[0].endpoints?.[0].parameters).toEqual([
      {
        name: 'page',
        in: 'query',
        schema: { type: 'number' }
      },
      {
        name: 'limit',
        in: 'query',
        schema: { type: 'number' }
      }
    ]);
  });

  it('should remove endpoint', () => {
    const apiId = getStore().addApi({
      name: 'Test API',
      description: 'Test API for endpoint operations',
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
              permissions: ['read']
            }
          ]
        }
      },
      entities: [
        {
          name: 'User',
          attributes: [
            { id: 'id', name: 'id', type: 'uuid', required: true },
            { id: 'name', name: 'name', type: 'string' }
          ],
          endpoints: [
            {
              path: '/users',
              method: 'GET',
              responses: {
                '200': {
                  description: 'Successful response'
                }
              }
            },
            {
              path: '/users/{id}',
              method: 'GET',
              responses: {
                '200': {
                  description: 'Successful response'
                }
              }
            }
          ]
        }
      ]
    });

    // Remove one endpoint
    const api = getStore().getApi(apiId);
    if (!api) throw new Error('API not found');

    const updatedEntities = api.entities.map(entity => ({
      ...entity,
      endpoints: entity.endpoints?.filter(ep => 
        !(ep.path === '/users/{id}' && ep.method === 'GET')
      )
    }));

    getStore().updateApi(apiId, { entities: updatedEntities });

    const updatedApi = getStore().getApi(apiId);
    expect(updatedApi?.entities[0].endpoints).toHaveLength(1);
    expect(updatedApi?.entities[0].endpoints?.[0].path).toBe('/users');
  });
});
