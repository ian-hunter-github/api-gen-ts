import { describe, it, expect, beforeEach } from '@jest/globals';
import { useApiConfigStore } from '../apiConfigStore';
import type { ApiConfig } from '../../types/api.types';

describe('apiConfigStore - Basic CRUD Operations', () => {
  beforeEach(() => {
    // Reset the store before each test
    useApiConfigStore.setState({ apis: {} });
  });

  const getStore = () => useApiConfigStore.getState();

  describe('create operations', () => {
    it('should create an empty API config', () => {
      const newApi: ApiConfig = {
        id: 'test-api',
        name: 'Test API',
        description: 'Test API description',
        version: '1.0.0',
        entities: [],
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const apiId = getStore().addApi(newApi);
      const addedApi = getStore().getApi(apiId);

      expect(addedApi).toMatchObject({
        name: 'Test API',
        version: '1.0.0',
      });
      expect(addedApi?.id).toBeDefined();
      expect(addedApi?.createdAt).toBeDefined();
      expect(addedApi?.updatedAt).toBeDefined();
    });
  });

  describe('read operations', () => {
    it('should return undefined for non-existent API', () => {
      expect(getStore().getApi('invalid-id')).toBeUndefined();
    });

    it('should return deep copy of API config', () => {
      const newApi: ApiConfig = {
        id: 'test-api',
        name: 'Test API',
        description: 'Test API description',
        version: '1.0.0',
        entities: [],
        security: {
          authentication: {
            type: 'jwt',
            jwt: { secret: 'secret', expiresIn: '1h' }
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const apiId = getStore().addApi(newApi);
      const firstCopy = getStore().getApi(apiId);
      const secondCopy = getStore().getApi(apiId);

      // Verify they are equal but not the same reference
      expect(firstCopy).toEqual(secondCopy);
      expect(firstCopy).not.toBe(secondCopy);
    });
  });

  describe('update operations', () => {
    it('should update an API config', () => {
      const newApi: ApiConfig = {
        id: 'test-api',
        name: 'Test API',
        description: 'Test API description',
        version: '1.0.0',
        entities: [],
        security: {
          authentication: {
            type: 'jwt',
            jwt: { secret: 'secret', expiresIn: '1h' }
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const apiId = getStore().addApi(newApi);
      getStore().updateApi(apiId, { name: 'Updated API', version: '1.1.0' });

      const updatedApi = getStore().getApi(apiId);
      expect(updatedApi).toMatchObject({
        name: 'Updated API',
        version: '1.1.0',
      });
      expect(updatedApi?.updatedAt).not.toBe(updatedApi?.createdAt);
    });

    it('should maintain immutability when updating', () => {
      const initialApi: ApiConfig = {
        id: 'test-api',
        name: 'Immutable API',
        description: 'Immutable API description',
        version: '1.0.0',
        entities: [],
        security: {
          authentication: {
            type: 'jwt',
            jwt: { secret: 'secret', expiresIn: '1h' }
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const apiId = getStore().addApi(initialApi);
      const originalApi = getStore().getApi(apiId);

      // Attempt to modify the returned object directly
      if (originalApi) {
        originalApi.name = 'Modified Name';
      }

      // Verify store state wasn't changed
      const currentApi = getStore().getApi(apiId);
      expect(currentApi?.name).toBe('Immutable API');
    });
  });

  describe('delete operations', () => {
    it('should remove an API config', () => {
      const newApi: ApiConfig = {
        id: 'test-api',
        name: 'Test API',
        description: 'Test API description',
        version: '1.0.0',
        entities: [],
        security: {
          authentication: {
            type: 'jwt',
            jwt: { secret: 'secret', expiresIn: '1h' }
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const apiId = getStore().addApi(newApi);
      getStore().removeApi(apiId);
      expect(getStore().getApi(apiId)).toBeUndefined();
    });
  });
});
