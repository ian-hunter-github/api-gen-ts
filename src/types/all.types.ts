/**
 * Type definitions generated from API schemas
 * @module API Types
 */

// ==================== Extracted Anonymous Types ====================

/**
 * Deployment provider-specific settings
 * @complex
 */
export type DeploymentSettings = 
  | { region: string; lambdaMemory?: number; apiGateway?: boolean }
  | { siteName: string; functionsDir?: string }
  | Record<string, unknown>;

/**
 * Schema definition for endpoint request/response content
 * @complex
 */
export interface EndpointContentSchema {
  type?: string;
  format?: string;
  properties?: Record<string, unknown>;
  items?: unknown;
  required?: string[];
  enum?: string[];
  $ref?: string;
  additionalProperties?: boolean | unknown;
  oneOf?: unknown[];
  anyOf?: unknown[];
  allOf?: unknown[];
  not?: unknown;
  nullable?: boolean;
}


// ==================== Cloud Provider Types ====================

/**
 * Azure Cloud Configuration
 * @complex
 */
export interface AzureConfig {
  /**
   * @complex
   */
  functionApp?: AzureFunctionAppConfig;
}

/**
 * GCP Cloud Configuration
 * @complex
 */
export interface GcpConfig {
  /**
   * @complex
   */
  cloudFunction?: GcpCloudFunctionConfig;
}

/**
 * Authorization Configuration
 * @complex
 */
export interface AuthorizationConfig {
  /**
   * @table
   */
  roles?: SecurityRole[];
  /**
   * @table
   */
  policies?: SecurityPolicy[];
}

// ==================== Common Types ====================

/**
 * JWT Authentication Configuration
 * @complex
 */
export interface JwtConfig {
  issuer?: string;
  audience?: string;
  secret?: string;
  expiresIn?: string;
}

/**
 * OAuth2 Authentication Configuration
 * @complex
 */
export interface OAuth2Config {
  authorizationUrl?: string;
  tokenUrl?: string;
  /**
   * @complex
   */
  scopes?: Record<string, string>;
}

/**
 * API Key Authentication Configuration
 * @complex
 */
export interface ApiKeyConfig {
  header?: string;
  queryParam?: string;
}

/**
 * Authentication Configuration
 * @complex
 */
export interface AuthenticationConfig {
  /**
   * @required
   * @enum ["none","basic","jwt","oauth2","api-key"]
   */
  type: string;
  /**
   * @complex
   */
  jwt?: JwtConfig;
  /**
   * @complex
   */
  oauth2?: OAuth2Config;
  /**
   * @complex
   */
  apiKey?: ApiKeyConfig;
}

/**
 * CORS Configuration
 * @complex
 */
export interface CorsConfig {
  /**
   * @default true
   */
  enabled: boolean;
  /**
   * @table
   */
  origins?: string[];
  /**
   * @table
   */
  methods?: string[];
  /**
   * @table
   */
  headers?: string[];
}

/**
 * AWS Lambda Configuration
 * @complex
 */
export interface AwsLambdaConfig {
  memorySize?: number;
  timeout?: number;
}

/**
 * AWS API Gateway Configuration
 * @complex
 */
export interface AwsApiGatewayConfig {
  stageName?: string;
}

/**
 * AWS Configuration
 * @complex
 */
export interface AwsConfig {
  /**
   * @complex
   */
  lambda?: AwsLambdaConfig;
  /**
   * @complex
   */
  apiGateway?: AwsApiGatewayConfig;
}

/**
 * Azure Function App Configuration
 * @complex
 */
export interface AzureFunctionAppConfig {
  plan?: string;
}

/**
 * GCP Cloud Function Configuration
 * @complex
 */
export interface GcpCloudFunctionConfig {
  memory?: string;
}

/**
 * Docker Configuration
 * @complex
 */
export interface DockerConfig {
  image?: string;
  port?: number;
}

/**
 * Scaling Configuration
 * @complex
 */
export interface ScalingConfig {
  minInstances?: number;
  maxInstances?: number;
}

/**
 * Monitoring Configuration
 * @complex
 */
export interface MonitoringConfig {
  /**
   * @default true
   */
  enabled: boolean;
  /**
   * @table
   */
  alerts?: MonitoringAlert[];
}

/**
 * Attribute Validation Rules
 * @complex
 */
export interface AttributeValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minimum?: number;
  maximum?: number;
}

/**
 * Security Policy Condition
 * @complex
 */
export interface PolicyCondition {
  operator: 'equals' | 'notEquals' | 'contains' | 'startsWith' | 'endsWith';
  value: string | number | boolean;
}

// ==================== API Config Types ====================

export type ApiConfigCollection = Record<string, ApiConfig>;

/**
 * Returns a default initialized ApiConfig object
 */
export function getDefaultApiConfig(): ApiConfig {
  return {
    id: '',
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

/**
 * API Configuration
 * @complex
 */
export interface ApiConfig {
  /**
   * @required
   */
  id: string;
  /**
   * @required
   * @pattern ^[a-zA-Z0-9_-]+$
   */
  name: string;
  description: string;
  version: string;
  basePath: string;
  /**
   * @enum
   * @default "development"
   */
  environment: 'development' | 'staging' | 'production';
  documentation?: {
    enabled: boolean;
    format: 'openapi' | 'asyncapi' | 'markdown';
  };
  /**
   * @table
   */
  entities: ApiEntity[];
  deployment: DeploymentConfig;
  security: ApiSecurity;
  endpoints?: {
    baseUrl: string;
    paths: Record<string, {
      path: string;
      operations: Record<string, EntityEndpoint>;
    }>;
  };
  createdAt: string;
  updatedAt?: string;
  isDemo?: boolean;
}

// ==================== Deployment Types ====================

/**
 * Deployment providers
 */
export type DeploymentProvider = 
  | 'aws' | 'azure' | 'gcp' | 'docker'
  | 'netlify' | 'vercel' | 'firebase-hosting'
  | 'heroku' | 'digitalocean' | 'cloudflare';

/**
 * Deployment Configuration
 * @complex
 */
export interface DeploymentConfig {
  /**
   * @required
   */
  provider: DeploymentProvider;
  settings: DeploymentSettings;
  name?: string;
  environment?: string;
  deploymentId?: string;
  description?: string;
  region?: string;
  /**
   * @format uri
   */
  url?: string;
  aws?: AwsConfig;
  azure?: AzureConfig;
  gcp?: GcpConfig;
  docker?: DockerConfig;
  scaling?: ScalingConfig;
  monitoring?: MonitoringConfig;
  /**
   * @format date-time
   */
  createdAt?: string;
  /**
   * @format date-time
   */
  updatedAt?: string;
}

/**
 * Monitoring Alert Configuration
 * @complex
 */
export interface MonitoringAlert {
  /**
   * @required
   */
  name: string;
  /**
   * @required
   */
  metric: string;
  /**
   * @required
   */
  threshold: number;
  /**
   * @enum ["gt","lt","eq"]
   * @default "gt"
   */
  operator?: string;
  period?: string;
  action?: string;
}

// ==================== Entity Types ====================

/**
 * API Entity Definition
 * @complex
 */
export interface ApiEntity {
  /**
   * @required
   */
  name: string;
  description?: string;
  /**
   * @required
   * @table
   */
  attributes: EntityAttribute[];
  /**
   * @table
   */
  relationships?: EntityRelationship[];
  /**
   * @table
   */
  endpoints?: EntityEndpoint[];
}

/**
 * Entity Attribute
 * @complex
 */
export interface EntityAttribute {
  /**
   * @required
   */
  id: string;
  /**
   * @required
   */
  name: string;
  /**
   * @required
   * @enum ["string","number","boolean","date","datetime","timestamp","uuid","object","array","reference","enum"]
   */
  type: string;
  /**
   * @default false
   */
  required?: boolean;
  unique?: boolean;
  description?: string;
  default?: string | number | boolean | Date | object | unknown[];
  enumValues?: string[];
  values?: string[];
  items?: Omit<EntityAttribute, 'items'>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

/**
 * Entity Relationship
 * @complex
 */
export interface EntityRelationship {
  /**
   * @required
   */
  name: string;
  /**
   * @required
   * @enum ["one-to-one","one-to-many","many-to-one","many-to-many"]
   */
  type: string;
  /**
   * @required
   */
  target: string;
  /**
   * @required
   */
  source: string;
  description?: string;
  /**
   * @default false
   */
  required?: boolean;
  inverse?: string;
  /**
   * Join table name for many-to-many relationships
   */
  through?: string;
}

/**
 * Entity Endpoint
 * @complex
 */
export interface EntityEndpoint {
  /**
   * @required
   */
  path: string;
  /**
   * @required
   * @enum ["GET","POST","PUT","PATCH","DELETE"]
   */
  method: string;
  description?: string;
  operationId?: string;
  /**
   * @table
   */
  parameters?: EndpointParameter[];
  requestBody?: {
    description?: string;
    required?: boolean;
    content: {
      [mimeType: string]: {
        schema: EndpointContentSchema;
      };
    };
  };
  responses?: {
    [statusCode: string]: {
      description: string;
      content?: {
        [mimeType: string]: {
          schema: EndpointContentSchema;
        };
      };
    };
  };
  security?: Array<{ [securityScheme: string]: string[] }>;
  tags?: string[];
}

/**
 * Endpoint Parameter
 * @complex
 */
export interface EndpointParameter {
  /**
   * @required
   */
  name: string;
  /**
   * @required
   * @enum ["query","header","path","cookie","body"]
   */
  in: string;
  description?: string;
  /**
   * @default false
   */
  required?: boolean;
  /**
   * @complex
   */
  schema: EndpointContentSchema;
}

/**
 * Endpoint Response
 * @complex
 */
export interface EndpointResponse {
  /**
   * @required
   */
  status: number;
  description?: string;
  /**
   * @complex
   */
  schema?: Record<string, unknown>;
}

// ==================== Security Types ====================

/**
 * API Security Configuration
 * @complex
 */
export interface ApiSecurity {
  /**
   * @required
   * @complex
   */
  authentication: AuthenticationConfig;
  /**
   * @complex
   */
  authorization?: AuthorizationConfig;
  cors?: CorsConfig;
}

/**
 * Security Role
 * @complex
 */
export interface SecurityRole {
  /**
   * @required
   */
  name: string;
  description?: string;
  /**
   * @table
   */
  permissions?: string[];
}

/**
 * Security Policy
 * @complex
 */
export interface SecurityPolicy {
  /**
   * @required
   */
  name: string;
  description?: string;
  /**
   * @required
   * @enum ["allow","deny"]
   */
  effect: string;
  /**
   * @required
   * @table
   */
  actions: string[];
  /**
   * @table
   */
  resources?: string[];
  /**
   * @complex
   */
  conditions?: Record<string, PolicyCondition>;
}
