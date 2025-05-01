import { ApiConfig, ApiEntity } from './all.types';
import { generateUUID } from '../utils/uuid';

export function getDefaultApiConfig(): ApiConfig {
  return {
    id: generateUUID(), 
    name: '',
    description: '',
    version: '1.0.0',
    basePath: '/api',
    environment: 'development',
    entities: [],
    deployment: {
      provider: 'docker',
      settings: {}
    },
    security: {
      authentication: {
        type: 'none'
      }
    },
    createdAt: new Date().toISOString()
  };
}

export function getDefaultApiEntity(): ApiEntity {
  return {
    name: 'New Entity',
    description: 'Entity description',
    attributes: [{
      id: generateUUID(),
      name: 'id',
      type: 'string',
      required: true,
      description: 'Unique identifier'
    }],
    relationships: [],
    endpoints: []
  };
}

export function initializeApiConfig(overrides: Partial<ApiConfig> = {}): ApiConfig {
  const config = getDefaultApiConfig();
  
  // Apply runtime values
  config.id = generateUUID();
  config.createdAt = new Date().toISOString();
  
  // Apply any overrides
  return { ...config, ...overrides };
}

export function initializeApiEntity(overrides: Partial<ApiEntity> = {}): ApiEntity {
  const entity = getDefaultApiEntity();
  return { ...entity, ...overrides };
}

// Generic type initialization pattern
export function initializeType<T>(
  getDefault: () => T,
  runtimeFields: Partial<T>,
  overrides: Partial<T> = {}
): T {
  const instance = getDefault();
  return { 
    ...instance,
    ...runtimeFields,
    ...overrides
  };
}
