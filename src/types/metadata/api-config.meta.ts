import { FieldMetadata } from './types';

export const DeploymentConfigMetadata: Record<string, FieldMetadata> = {
  name: {
    type: { kind: 'primitive', type: 'string' },
    validation: { required: true },
    likelyWidthChars: 20
  },
  environment: {
    type: { kind: 'enum', values: ['development', 'staging', 'production'] },
    validation: { required: true },
    likelyWidthChars: 13
  },
  target: {
    type: { kind: 'enum', values: ['aws', 'azure', 'gcp', 'on-premise', 'docker'] },
    validation: { required: true },
    likelyWidthChars: 12
  },
  deploymentId: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 12
  },
  description: {
    type: { kind: 'primitive', type: 'string' },
    component: 'textarea',
    likelyWidthChars: 50,
  },
  region: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 10
  },
  url: {
    type: { kind: 'primitive', type: 'string' },
    format: 'uri',
    likelyWidthChars: 25
  },
  aws: {
    type: { kind: 'complex', type: 'DeploymentConfig' },
    component: 'accordion'
  },
  azure: {
    type: { kind: 'complex', type: 'DeploymentConfig' },
    component: 'accordion'
  },
  gcp: {
    type: { kind: 'complex', type: 'DeploymentConfig' },
    component: 'accordion'
  },
  docker: {
    type: { kind: 'complex', type: 'DeploymentConfig' },
    component: 'accordion'
  },
  scaling: {
    type: { kind: 'complex', type: 'DeploymentConfig' },
    component: 'accordion'
  },
  monitoring: {
    type: { kind: 'complex', type: 'DeploymentConfig' },
    component: 'accordion'
  },
  createdAt: {
    type: { kind: 'primitive', type: 'datetime' },
    format: 'date-time'
  },
  updatedAt: {
    type: { kind: 'primitive', type: 'datetime' },
    format: 'date-time'
  }
};

export const ApiConfigMetadata: Record<string, FieldMetadata> = {
  id: {
    type: { kind: 'primitive', type: 'string' },
    validation: { required: true },
    likelyWidthChars: 8,
    hidden: true
  },
  name: {
    type: { kind: 'primitive', type: 'string' },
    validation: { 
      required: true,
      pattern: '^[ a-zA-Z0-9_-]+$'
    },
    likelyWidthChars: 20
  },
  description: {
    type: { kind: 'primitive', type: 'string' },
    component: 'textarea',
    likelyWidthChars: 50
  },
  version: {
    type: { kind: 'primitive', type: 'string' },
    validation: { required: true },
    likelyWidthChars: 8
  },
  basePath: {
    type: { kind: 'primitive', type: 'string' },
    validation: { required: true },
    likelyWidthChars: 15
  },
  environment: {
    type: { kind: 'enum', values: ['development', 'staging', 'production'] },
    defaultValue: 'development',
    likelyWidthChars: 13
  },
  entities: {
    type: { 
      kind: 'array', 
      itemType: { 
        kind: 'complex', 
        type: 'ApiEntity',
        meta: 'ApiEntityMetadata'
      } 
    },
    component: 'accordion'
  },
  deployment: {
    type: { kind: 'complex', type: 'DeploymentConfig' },
    component: 'accordion'
  },
  security: {
    type: { kind: 'complex', type: 'ApiSecurity' }
  },
  createdAt: {
    type: { kind: 'primitive', type: 'datetime' },
    validation: { required: true },
    format: 'date-time',
    likelyWidthChars: 20
  },
  updatedAt: {
    type: { kind: 'primitive', type: 'datetime' },
    format: 'date-time',
    likelyWidthChars: 20
  },
  isDemo: {
    type: { kind: 'primitive', type: 'boolean' },
    component: 'checkbox'
  }
};

export const ApiEntityMetadata: Record<string, FieldMetadata> = {
  name: {
    type: { kind: 'primitive', type: 'string' },
    validation: { required: true },
    likelyWidthChars: 20
  },
  description: {
    type: { kind: 'primitive', type: 'string' },
    component: 'textarea',
    likelyWidthChars: 50
  },
  attributes: {
    type: { 
      kind: 'array', 
      itemType: { 
        kind: 'complex', 
        type: 'EntityAttribute',
        meta: 'EntityAttributeMetadata'
      } 
    },
    isArray: true,
    component: 'table'
  },
  relationships: {
    type: { 
      kind: 'array', 
      itemType: { 
        kind: 'complex', 
        type: 'EntityRelationship',
        meta: 'EntityRelationshipMetadata'
      } 
    },
    isArray: true,
    component: 'table'
  },
  endpoints: {
    type: { 
      kind: 'array', 
      itemType: { 
        kind: 'complex', 
        type: 'EntityEndpoint',
        meta: 'EntityEndpointMetadata'
      } 
    },
    isArray: true,
    component: 'table'
  }
};

export const ApiSecurityMetadata: Record<string, FieldMetadata> = {
  authentication: {
    type: { kind: 'complex', type: 'AuthenticationConfig' },
    component: 'accordion',
    validation: { required: true }
  },
  authorization: {
    type: { kind: 'complex', type: 'AuthorizationConfig' },
    component: 'accordion'
  },
  cors: {
    type: { kind: 'complex', type: 'CorsConfig' },
    component: 'accordion'
  }
};

export const AuthenticationConfigMetadata: Record<string, FieldMetadata> = {
  type: {
    type: { kind: 'enum', values: ['none', 'basic', 'jwt', 'oauth2', 'api-key'] },
    validation: { required: true },
    likelyWidthChars: 9
  },
  jwt: {
    type: { kind: 'complex', type: 'JwtConfig' },
    component: 'accordion'
  },
  oauth2: {
    type: { kind: 'complex', type: 'OAuth2Config' },
    component: 'accordion'
  },
  apiKey: {
    type: { kind: 'complex', type: 'ApiKeyConfig' },
    component: 'accordion'
  }
};

export const CorsConfigMetadata: Record<string, FieldMetadata> = {
  enabled: {
    type: { kind: 'primitive', type: 'boolean' },
    defaultValue: true
  },
  origins: {
    type: { kind: 'array', itemType: { kind: 'primitive', type: 'string' } },
    isArray: true,
    component: 'table'
  },
  methods: {
    type: { kind: 'array', itemType: { kind: 'primitive', type: 'string' } },
    isArray: true,
    component: 'table'
  },
  headers: {
    type: { kind: 'array', itemType: { kind: 'primitive', type: 'string' } },
    isArray: true,
    component: 'table'
  }
};

export const AzureConfigMetadata: Record<string, FieldMetadata> = {
  functionApp: {
    type: { kind: 'complex', type: 'AzureConfig' },
    component: 'accordion'
  }
};

export const GcpConfigMetadata: Record<string, FieldMetadata> = {
  cloudFunction: {
    type: { kind: 'complex', type: 'GcpConfig' },
    component: 'accordion'
  }
};

export const AuthorizationConfigMetadata: Record<string, FieldMetadata> = {
  roles: {
    type: { kind: 'array', itemType: { kind: 'complex', type: 'SecurityRole' } },
    isArray: true,
    component: 'table'
  },
  policies: {
    type: { kind: 'array', itemType: { kind: 'complex', type: 'SecurityPolicy' } },
    isArray: true,
    component: 'table'
  }
};

export const JwtConfigMetadata: Record<string, FieldMetadata> = {
  issuer: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 20
  },
  audience: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 20
  },
  secret: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 30
  },
  expiresIn: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 10
  }
};

export const OAuth2ConfigMetadata: Record<string, FieldMetadata> = {
  authorizationUrl: {
    type: { kind: 'primitive', type: 'string' },
    format: 'uri',
    likelyWidthChars: 30
  },
  tokenUrl: {
    type: { kind: 'primitive', type: 'string' },
    format: 'uri',
    likelyWidthChars: 30
  },
  scopes: {
    type: { kind: 'complex', type: 'OAuth2Scopes' },
    component: 'accordion'
  }
};

export const ApiKeyConfigMetadata: Record<string, FieldMetadata> = {
  header: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 15
  },
  queryParam: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 15
  }
};

export const AwsConfigMetadata: Record<string, FieldMetadata> = {
  lambda: {
    type: { kind: 'complex', type: 'AwsConfig' },
    component: 'accordion'
  },
  apiGateway: {
    type: { kind: 'complex', type: 'AwsConfig' },
    component: 'accordion'
  }
};

export const AwsLambdaConfigMetadata: Record<string, FieldMetadata> = {
  memorySize: {
    type: { kind: 'primitive', type: 'number' },
    likelyWidthChars: 5
  },
  timeout: {
    type: { kind: 'primitive', type: 'number' },
    likelyWidthChars: 5
  }
};

export const AwsApiGatewayConfigMetadata: Record<string, FieldMetadata> = {
  stageName: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 15
  }
};

export const AzureFunctionAppConfigMetadata: Record<string, FieldMetadata> = {
  plan: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 15
  }
};

export const GcpCloudFunctionConfigMetadata: Record<string, FieldMetadata> = {
  memory: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 10
  }
};

export const DockerConfigMetadata: Record<string, FieldMetadata> = {
  image: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 20
  },
  port: {
    type: { kind: 'primitive', type: 'number' },
    likelyWidthChars: 5
  }
};

export const ScalingConfigMetadata: Record<string, FieldMetadata> = {
  minInstances: {
    type: { kind: 'primitive', type: 'number' },
    likelyWidthChars: 5
  },
  maxInstances: {
    type: { kind: 'primitive', type: 'number' },
    likelyWidthChars: 5
  }
};

export const MonitoringConfigMetadata: Record<string, FieldMetadata> = {
  enabled: {
    type: { kind: 'primitive', type: 'boolean' },
    defaultValue: true
  },
  alerts: {
    type: { kind: 'array', itemType: { kind: 'complex', type: 'MonitoringAlert' } },
    isArray: true,
    component: 'table'
  }
};

export const MonitoringAlertMetadata: Record<string, FieldMetadata> = {
  name: {
    type: { kind: 'primitive', type: 'string' },
    validation: { required: true },
    likelyWidthChars: 20
  },
  metric: {
    type: { kind: 'primitive', type: 'string' },
    validation: { required: true },
    likelyWidthChars: 20
  },
  threshold: {
    type: { kind: 'primitive', type: 'number' },
    validation: { required: true },
    likelyWidthChars: 5
  },
  operator: {
    type: { kind: 'enum', values: ['gt', 'lt', 'eq'] },
    defaultValue: 'gt',
    likelyWidthChars: 5
  },
  period: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 10
  },
  action: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 15
  }
};

export const SecurityRoleMetadata: Record<string, FieldMetadata> = {
  name: {
    type: { kind: 'primitive', type: 'string' },
    validation: { required: true },
    likelyWidthChars: 20
  },
  description: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 50
  },
  permissions: {
    type: { kind: 'array', itemType: { kind: 'primitive', type: 'string' } },
    isArray: true,
    component: 'table'
  }
};

export const SecurityPolicyMetadata: Record<string, FieldMetadata> = {
  name: {
    type: { kind: 'primitive', type: 'string' },
    validation: { required: true },
    likelyWidthChars: 20
  },
  description: {
    type: { kind: 'primitive', type: 'string' },
    likelyWidthChars: 50
  },
  effect: {
    type: { kind: 'enum', values: ['allow', 'deny'] },
    validation: { required: true },
    likelyWidthChars: 8
  },
  actions: {
    type: { kind: 'array', itemType: { kind: 'primitive', type: 'string' } },
    isArray: true,
    validation: { required: true },
    component: 'table'
  },
  resources: {
    type: { kind: 'array', itemType: { kind: 'primitive', type: 'string' } },
    isArray: true,
    component: 'table'
  },
  conditions: {
    type: { kind: 'complex', type: 'PolicyCondition' },
    component: 'accordion'
  }
};

export const PolicyConditionMetadata: Record<string, FieldMetadata> = {
  operator: {
    type: { kind: 'enum', values: ['equals', 'notEquals', 'contains', 'startsWith', 'endsWith'] },
    validation: { required: true },
    likelyWidthChars: 10
  },
  value: {
    type: { kind: 'primitive', type: 'string' },
    validation: { required: true },
    likelyWidthChars: 15
  }
};

// Centralized metadata registry
export const MetadataRegistry = {
  ApiConfigMetadata,
  ApiEntityMetadata,
  ApiSecurityMetadata,
  AuthenticationConfigMetadata,
  AuthorizationConfigMetadata,
  CorsConfigMetadata,
  JwtConfigMetadata,
  OAuth2ConfigMetadata,
  ApiKeyConfigMetadata,
  AwsConfigMetadata,
  AwsLambdaConfigMetadata,
  AwsApiGatewayConfigMetadata,
  AzureConfigMetadata,
  AzureFunctionAppConfigMetadata,
  GcpConfigMetadata,
  GcpCloudFunctionConfigMetadata,
  DockerConfigMetadata,
  ScalingConfigMetadata,
  MonitoringConfigMetadata,
  MonitoringAlertMetadata,
  SecurityRoleMetadata,
  SecurityPolicyMetadata,
  PolicyConditionMetadata,
  DeploymentConfigMetadata
};
