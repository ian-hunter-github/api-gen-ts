import { FieldMetadata } from './types';

export const DeploymentConfigMetadata: Record<string, FieldMetadata> = {
  name: {
    type: 'string',
    validation: { required: true },
    likelyWidthChars: 20
  },
  environment: {
    type: 'enum',
    enumValues: ['development', 'staging', 'production'],
    validation: { required: true },
    likelyWidthChars: 13
  },
  target: {
    type: 'enum',
    enumValues: ['aws', 'azure', 'gcp', 'on-premise', 'docker'],
    validation: { required: true },
    likelyWidthChars: 12
  },
  deploymentId: {
    type: 'string',
    likelyWidthChars: 12
  },
  description: {
    type: 'string',
    component: 'textarea',
    likelyWidthChars: 50,
  },
  region: {
    type: 'string',
    likelyWidthChars: 10
  },
  url: {
    type: 'string',
    format: 'uri',
    likelyWidthChars: 25
  },
  aws: {
    type: 'object',
    component: 'json'
  },
  azure: {
    type: 'object',
    component: 'json'
  },
  gcp: {
    type: 'object',
    component: 'json'
  },
  docker: {
    type: 'object',
    component: 'json'
  },
  scaling: {
    type: 'object',
    component: 'json'
  },
  monitoring: {
    type: 'object',
    component: 'json'
  },
  createdAt: {
    type: 'datetime',
    format: 'date-time'
  },
  updatedAt: {
    type: 'datetime',
    format: 'date-time'
  }
};

export const ApiConfigMetadata: Record<string, FieldMetadata> = {
  id: {
    type: 'string',
    validation: { required: true },
    likelyWidthChars: 8
  },
  name: {
    type: 'string',
    validation: { 
      required: true,
      pattern: '^[a-zA-Z0-9_-]+$'
    },
    likelyWidthChars: 20
  },
  description: {
    type: 'string',
    component: 'textarea',
    likelyWidthChars: 50
  },
  version: {
    type: 'string',
    validation: { required: true },
    likelyWidthChars: 8
  },
  basePath: {
    type: 'string',
    validation: { required: true },
    likelyWidthChars: 15
  },
  environment: {
    type: 'enum',
    enumValues: ['development', 'staging', 'production'],
    defaultValue: 'development',
    likelyWidthChars: 13
  },
  entities: {
    type: 'array',
    isArray: true,
    component: 'table'
  },
  deployment: {
    type: 'object',
    component: 'json'
  },
  security: {
    type: 'object',
    component: 'json'
  },
  createdAt: {
    type: 'datetime',
    validation: { required: true },
    format: 'date-time',
    likelyWidthChars: 20
  },
  updatedAt: {
    type: 'datetime',
    format: 'date-time',
    likelyWidthChars: 20
  },
  isDemo: {
    type: 'boolean',
    component: 'checkbox'
  }
};

export const ApiEntityMetadata: Record<string, FieldMetadata> = {
  name: {
    type: 'string',
    validation: { required: true },
    likelyWidthChars: 20
  },
  description: {
    type: 'string',
    component: 'textarea',
    likelyWidthChars: 50
  },
  attributes: {
    type: 'array',
    isArray: true,
    component: 'table'
  },
  relationships: {
    type: 'array',
    isArray: true,
    component: 'table'
  },
  endpoints: {
    type: 'array',
    isArray: true,
    component: 'table'
  }
};

export const ApiSecurityMetadata: Record<string, FieldMetadata> = {
  authentication: {
    type: 'object',
    component: 'json',
    validation: { required: true }
  },
  authorization: {
    type: 'object',
    component: 'json'
  },
  cors: {
    type: 'object',
    component: 'json'
  }
};

export const AuthenticationConfigMetadata: Record<string, FieldMetadata> = {
  type: {
    type: 'enum',
    enumValues: ['none', 'basic', 'jwt', 'oauth2', 'api-key'],
    validation: { required: true },
    likelyWidthChars: 9
  },
  jwt: {
    type: 'object',
    component: 'json'
  },
  oauth2: {
    type: 'object',
    component: 'json'
  },
  apiKey: {
    type: 'object',
    component: 'json'
  }
};

export const CorsConfigMetadata: Record<string, FieldMetadata> = {
  enabled: {
    type: 'boolean',
    defaultValue: true
  },
  origins: {
    type: 'array',
    isArray: true,
    component: 'table'
  },
  methods: {
    type: 'array',
    isArray: true,
    component: 'table'
  },
  headers: {
    type: 'array',
    isArray: true,
    component: 'table'
  }
};
