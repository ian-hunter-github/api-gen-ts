import { describe, it, expect, beforeEach } from '@jest/globals';
import { useApiConfigStore } from '../apiConfigStore';

describe('apiConfigStore - Comprehensive Chat API Example', () => {
  beforeEach(() => {
    useApiConfigStore.setState({ apis: {} });
  });

  const getStore = () => useApiConfigStore.getState();

  it('should create, validate and delete a complete chat API configuration', () => {
    // Create API with comprehensive configuration
    const apiId = getStore().addApi({
      name: 'Chat API',
      version: '1.0.0',
      security: {
        authentication: {
          type: 'jwt',
          jwt: {
            secret: 'super-secret-key',
            expiresIn: '15m',
            refreshToken: {
              expiresIn: '7d'
            }
          }
        },
        authorization: {
          roles: [
            {
              name: 'admin',
              description: 'Full access',
              permissions: ['*']
            },
            {
              name: 'moderator',
              description: 'Can manage chat rooms',
              permissions: ['rooms:create', 'rooms:delete', 'messages:delete']
            },
            {
              name: 'user',
              description: 'Standard user',
              permissions: ['messages:create', 'rooms:join']
            }
          ],
          policies: [
            {
              name: 'room-owner',
              rules: [
                {
                  resource: 'rooms',
                  action: ['update', 'delete'],
                  condition: 'resource.createdBy == user.id'
                }
              ]
            }
          ]
        }
      },
      entities: [
        {
          name: 'User',
          description: 'Chat application user',
          attributes: [
            { name: 'id', type: 'uuid', required: true },
            { name: 'username', type: 'string', required: true, unique: true },
            { name: 'email', type: 'string', required: true, unique: true },
            { name: 'status', type: 'enum', values: ['online', 'offline', 'away'], default: 'offline' },
            { name: 'lastSeen', type: 'timestamp' }
          ],
          relationships: [
            {
              name: 'messages',
              type: 'one-to-many',
              source: 'User',
              target: 'Message',
              inverse: 'sender'
            },
            {
              name: 'rooms',
              type: 'many-to-many',
              source: 'User',
              target: 'ChatRoom',
              through: 'UserChatRoom'
            }
          ]
        },
        {
          name: 'ChatRoom',
          description: 'Chat room where users can communicate',
          attributes: [
            { name: 'id', type: 'uuid', required: true },
            { name: 'name', type: 'string', required: true },
            { name: 'description', type: 'string' },
            { name: 'type', type: 'enum', values: ['public', 'private'], default: 'public' },
            { name: 'createdAt', type: 'timestamp', required: true },
            { name: 'createdBy', type: 'uuid', required: true }
          ],
          relationships: [
            {
              name: 'messages',
              type: 'one-to-many',
              source: 'ChatRoom',
              target: 'Message',
              inverse: 'room'
            },
            {
              name: 'members',
              type: 'many-to-many',
              source: 'ChatRoom',
              target: 'User',
              through: 'UserChatRoom',
              inverse: 'rooms'
            }
          ]
        },
        {
          name: 'Message',
          description: 'Chat message',
          attributes: [
            { name: 'id', type: 'uuid', required: true },
            { name: 'content', type: 'string', required: true },
            { name: 'timestamp', type: 'timestamp', required: true },
            { name: 'edited', type: 'boolean', default: false }
          ],
          relationships: [
            {
              name: 'sender',
              type: 'many-to-one',
              source: 'Message',
              target: 'User',
              inverse: 'messages'
            },
            {
              name: 'room',
              type: 'many-to-one',
              source: 'Message',
              target: 'ChatRoom',
              inverse: 'messages'
            }
          ]
        },
        {
          name: 'UserChatRoom',
          description: 'Join table for users and rooms',
          attributes: [
            { name: 'userId', type: 'uuid', required: true },
            { name: 'roomId', type: 'uuid', required: true },
            { name: 'joinedAt', type: 'timestamp', required: true },
            { name: 'role', type: 'enum', values: ['member', 'admin'], default: 'member' }
          ]
        }
      ],
      endpoints: {
        baseUrl: '/api/v1',
        paths: {
          '/users': {
            path: '/users',
            method: 'POST',
            operationId: 'createUser',
            description: 'Register new user',
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
          },
          '/users/{id}': {
            path: '/users/{id}',
            method: 'GET',
            operationId: 'getUser',
            description: 'Get user by ID',
            responses: {
              '200': {
                description: 'User found',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/User'
                    }
                  }
                }
              }
            }
          },
          '/rooms': {
            path: '/rooms',
            method: 'POST',
            operationId: 'createRoom',
            description: 'Create new chat room',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ChatRoom'
                  }
                }
              }
            },
            responses: {
              '201': {
                description: 'Room created',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/ChatRoom'
                    }
                  }
                }
              }
            }
          },
          '/rooms/{id}/messages': {
            path: '/rooms/{id}/messages',
            method: 'GET',
            operationId: 'getRoomMessages',
            description: 'Get messages in room',
            responses: {
              '200': {
                description: 'List of messages',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Message'
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // Validate API was created correctly
    const api = getStore().getApi(apiId);
    expect(api).toBeDefined();
    expect(api?.name).toBe('Chat API');
    expect(api?.entities).toHaveLength(4);
    expect(api?.endpoints?.paths).toBeDefined();
    expect(Object.keys(api?.endpoints?.paths || {})).toHaveLength(4);

    // Validate security configuration
    expect(api?.security?.authentication?.type).toBe('jwt');
    expect(api?.security?.authorization?.roles).toHaveLength(3);

    // Validate entity relationships
    const userEntity = api?.entities.find(e => e.name === 'User');
    expect(userEntity?.relationships?.length).toBe(2);
    expect(userEntity?.relationships?.[0]?.type).toBe('one-to-many');

    // Delete API and verify removal
    getStore().removeApi(apiId);
    expect(getStore().getApi(apiId)).toBeUndefined();
  });
});
