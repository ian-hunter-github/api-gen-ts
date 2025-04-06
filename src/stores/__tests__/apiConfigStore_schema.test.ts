import { Validator } from 'jsonschema';
import type { ApiConfig } from '../../types/api.types';
import apiConfigSchema from '../../schema/api-config.schema.json';
import entitySchema from '../../schema/entity.schema.json';
import securitySchema from '../../schema/security.schema.json';
import deploymentSchema from '../../schema/deployment.schema.json';

describe('APIConfig Schema Validation', () => {
  it('should validate a complex APIConfig against the schema', () => {
    const complexConfig: ApiConfig = {
      id: 'test-api-1',
      name: 'Test API',
      version: '1.0.0',
      entities: [
        {
          name: 'User',
          description: 'System user',
          attributes: [
            {
              name: 'id',
              type: 'string',
              description: 'User ID'
            }
          ]
        }
      ],
      security: {
        authentication: {
          type: 'jwt',
          jwt: {
            secret: 'super-secret-key',
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
              name: 'editor',
              description: 'Editor role',
              permissions: ['create', 'read', 'update']
            },
            {
              name: 'viewer',
              description: 'Viewer role',
              permissions: ['read']
            }
          ]
        }
      },
      deployments: [
        {
          provider: 'aws',
          settings: {
            region: 'us-east-1',
            lambdaMemory: 512
          }
        }
      ],
      dataSources: [
        {
          name: 'main-db',
          type: 'postgres',
          config: {
            host: 'localhost',
            port: 5432,
            database: 'test_db',
            username: 'postgres',
            password: 'postgres'
          }
        }
      ],
      createdAt: '2025-05-04T16:30:00Z',
      updatedAt: '2025-05-04T16:30:00Z'
    };

    const v = new Validator();
    // Add local schema references with their URIs
    v.addSchema(entitySchema, entitySchema.$id);
    v.addSchema(securitySchema, securitySchema.$id);
    v.addSchema(deploymentSchema, deploymentSchema.$id);
    const validationResult = v.validate(complexConfig, apiConfigSchema);
    if (!validationResult.valid) {
      console.log('Validation errors:', validationResult.errors);
    }
    expect(validationResult.valid).toBe(true);
    expect(validationResult.errors).toEqual([]);
  });

  it('should fail validation for invalid APIConfig', () => {
    const invalidConfig = {
      // Missing required 'name' field
      version: 'invalid-version', // Invalid version format
      entities: [], // Empty array not allowed
      deployments: [
        {
          provider: 'aws',
          settings: {
            region: 'invalid-region'
          }
        }
      ]
    };

    const v = new Validator();
    // Add local schema references with their URIs
    v.addSchema(entitySchema, entitySchema.$id);
    v.addSchema(securitySchema, securitySchema.$id);
    v.addSchema(deploymentSchema, deploymentSchema.$id);
    const validationResult = v.validate(invalidConfig, apiConfigSchema);
    expect(validationResult.valid).toBe(false);
    expect(validationResult.errors.length).toBeGreaterThan(0);
  });
});
