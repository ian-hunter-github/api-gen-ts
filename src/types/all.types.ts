
//////////////////////////////////////////
//  ./api.types.ts

// New named types for previously anonymous structures
// Documentation configuration
export type DocumentationType = {
  enabled: boolean;
  format: 'openapi' | 'asyncapi' | 'markdown';
};

// Datasource connection configuration
export type DatasourceConnectionType = {
  url?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  auth?: {
    type: 'basic' | 'bearer' | 'apiKey';
    credentials: string;
  };
  anonKey?: string;
  serviceRoleKey?: string;
  projectId?: string;
  apiKey?: string;
  databaseURL?: string;
  region?: string;
  filename?: string;
  endpoint?: string;
  key?: string;
  ssl?: boolean;
  tls?: boolean;
  replicaSet?: string;
  schema?: string;
  pool?: {
    min?: number;
    max?: number;
  };
};

// Datasource type configuration
export type DatasourceType = {
  type: 'postgres' | 'mysql' | 'mongodb' | 'rest' | 'graphql' | 'supabase' | 'firebase' | 'firestore' | 'dynamodb' | 'redis' | 'sqlite' | 'cosmosdb';
  connection?: DatasourceConnectionType;
};

// CI/CD configuration
export type CicdType = {
  enabled: boolean;
  stages?: string[];
};

// Schema property definition
type SchemaPropertyType = {
  type?: string;
  format?: string;
  $ref?: string;
  items?: SchemaPropertyType;
  required?: string[];
  enum?: string[];
  additionalProperties?: boolean | SchemaPropertyType;
};

// Request schema definition
type RequestSchemaType = {
  $ref?: string;
  type?: string;
  properties?: Record<string, SchemaPropertyType>;
};

// Request body content
type RequestBodyContentType = {
  schema?: RequestSchemaType;
};

// Response schema definition
type ResponseSchemaType = {
  $ref?: string;
  type?: string;
};

// Response content
type ResponseContentType = {
  schema?: ResponseSchemaType;
};

// Request body configuration
type RequestBodyType = {
  required?: boolean;
  content?: Record<string, RequestBodyContentType>;
};

// Response configuration
type ResponseType = {
  description?: string;
  content?: Record<string, ResponseContentType>;
};

// Endpoint responses mapping
type EndpointResponsesType = Record<string, ResponseType>;

// Endpoint path configuration
type EndpointPathType = {
  path: string;
  method: string;
  operationId?: string;
  description?: string;
  requestBody?: RequestBodyType;
  responses?: EndpointResponsesType;
};

// Endpoints configuration
type EndpointsType = {
  baseUrl: string;
  paths: Record<string, EndpointPathType>;
};

// JWT configuration
type JwtRefreshTokenConfig = {
  expiresIn: string;
};

type JwtConfigType = {
  secret: string;
  expiresIn: string;
  issuer?: string;
  audience?: string;
  refreshToken?: JwtRefreshTokenConfig;
};

// OAuth2 configuration
type OAuth2ConfigType = {
  authorizationUrl: string;
  tokenUrl: string;
  scopes: Record<string, string>;
};

// API Key configuration
type ApiKeyConfigType = {
  header?: string;
  queryParam?: string;
};

// API Security Authentication
type ApiSecurityAuthenticationType = {
  type: 'none' | 'basic' | 'jwt' | 'oauth2' | 'api-key';
  jwt?: JwtConfigType;
  oauth2?: OAuth2ConfigType;
  apiKey?: ApiKeyConfigType;
};

// API Security Authorization Role
type ApiSecurityAuthorizationRoleType = {
  name: string;
  description: string;
  permissions: string[];
};

// API Security Authorization Policy Rule
type ApiSecurityAuthorizationPolicyRuleType = {
  resource: string;
  action: string[];
  condition?: string;
};

// API Security Authorization Policy
type ApiSecurityAuthorizationPolicyType = {
  name: string;
  description?: string;
  rules?: ApiSecurityAuthorizationPolicyRuleType[];
  effect?: 'allow' | 'deny';
  actions?: string[];
  resources?: string[];
  conditions?: Record<string, unknown>;
};

// CORS configuration
type ApiSecurityCorsType = {
  enabled?: boolean;
  origins?: string[];
  methods?: string[];
  headers?: string[];
};

// Deployment settings
type AwsDeploymentSettings = {
  region: string;
  lambdaMemory?: number;
  apiGateway?: boolean;
};

type NetlifyDeploymentSettings = {
  siteName: string;
  functionsDir?: string;
};

type DeploymentConfigSettingsType = 
  | AwsDeploymentSettings
  | NetlifyDeploymentSettings
  | Record<string, unknown>;

// Entity endpoint content schema
type EntityEndpointContentSchemaType = {
  schema: SchemaType;
};


/**
 * Main API configuration type
 */
export type ApiConfig = {
  id: string;
  name: string;
  description: string;
  isDemo?: boolean;
  version: string;
  basePath?: string;
  documentation?: DocumentationType;
  entities: ApiEntity[];
  security: ApiSecurity;
  components?: ApiComponents;
  datasource?: DatasourceType;
  deployment?: DeploymentConfig[];
  cicd?: CicdType;
  versionControl?: VCSConfig;
  createdAt: string;
  updatedAt?: string;
  endpoints?: EndpointsType;
};

export type ApiConfigCollection = Record<string, ApiConfig>;


//////////////////////////////////////////
//  ./components.ts

/**
 * API component schemas
 */
type SchemaDefinition = {
  type: string;
  properties: Record<string, unknown>;
  required?: string[];
};

export type ApiComponents = {
  schemas: Record<string, SchemaDefinition>;
};

//////////////////////////////////////////
//  ./version-control.ts

/**
 * Version control providers
 */
export type VCSProvider = 'github' | 'gitlab' | 'bitbucket' | 'azure-repos';

type VCSConfigType = {
  repo: string;
  branch: string;
  accessToken: string;
  webhookSecret?: string;
};

export type VCSConfig = {
  provider: VCSProvider;
  config: VCSConfigType;
};

//////////////////////////////////////////
//  ./datasource.ts

/**
 * Data source configuration types
 */


/**
 * Common database configuration
 */
type DatabasePoolConfig = {
  min?: number;
  max?: number;
};

export type DatabaseCommon = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  pool?: DatabasePoolConfig;
};

/**
 * Database-specific configurations
 */
export type PostgresConfig = DatabaseCommon & { ssl?: boolean };
export type MySQLConfig = DatabaseCommon & { replicaSet?: string };
export type MongoDBConfig = DatabaseCommon & { tls?: boolean };
export type SQLiteConfig = { filename: string };

/**
 * Supabase configuration
 */
type SupabaseStorageConfig = {
  bucket: string;
  public?: boolean;
};

export type SupabaseConfig = {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  schema?: string;
  storage?: SupabaseStorageConfig;
};

/**
 * Firebase configuration
 */
export type FirebaseConfig = {
  projectId: string;
  apiKey: string;
  authDomain?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
};

/**
 * Firestore configuration
 */
export type FirestoreConfig = {
  databaseURL: string;
  serviceAccount?: Record<string, unknown>;
};

/**
 * REST/GraphQL API configuration
 */
type APIAuthConfig = {
  type: 'basic' | 'bearer' | 'apiKey';
  credentials: string;
};

export type APIConfig = {
  baseUrl: string;
  auth?: APIAuthConfig;
};

export type GraphQLConfig = APIConfig & { schemaFile?: string };

/**
 * Data source types
 */
export type DataSourceType = 
  | 'postgres' | 'mysql' | 'mongodb' 
  | 'rest' | 'graphql' | 'supabase' 
  | 'firebase' | 'firestore' | 'dynamodb'
  | 'redis' | 'sqlite' | 'cosmosdb';

type DynamoDBConfigType = {
  region: string;
  endpoint?: string;
};

type CosmosDBConfigType = {
  endpoint: string;
  key: string;
};

export type DataSource = {
  name: string;
  type: DataSourceType;
  config: 
    | PostgresConfig
    | MySQLConfig
    | MongoDBConfig
    | SQLiteConfig
    | SupabaseConfig
    | FirebaseConfig
    | FirestoreConfig
    | DynamoDBConfigType
    | CosmosDBConfigType
    | APIConfig
    | GraphQLConfig;
  entities?: string[];
};

//////////////////////////////////////////
//  ./security.ts

/**
 * API security configuration
 */
type ApiSecurityAuthorizationType = {
  roles?: ApiSecurityAuthorizationRoleType[];
  policies?: ApiSecurityAuthorizationPolicyType[];
};

export type ApiSecurity = {
  authentication: ApiSecurityAuthenticationType;
  authorization?: ApiSecurityAuthorizationType;
  cors?: ApiSecurityCorsType;
};

//////////////////////////////////////////
//  ./deployment.ts

/**
 * Deployment providers
 */
export type DeploymentProvider = 
  | 'aws' | 'azure' | 'gcp' 
  | 'netlify' | 'vercel' | 'firebase-hosting'
  | 'heroku' | 'digitalocean' | 'cloudflare';

export type DeploymentConfig = {
  provider: DeploymentProvider;
  settings: DeploymentConfigSettingsType;
};

//////////////////////////////////////////
//  ./entities/relationships.ts

/**
 * Entity relationship types
 */
export type RelationshipType = 
  | 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';

export type EntityRelationship = {
  name: string;
  type: RelationshipType;
  source: string;
  target: string;
  description?: string;
  required?: boolean;
  cascade?: boolean;
  inverse?: string; // The name of the inverse relationship in the target entity
  orphanRemoval?: boolean;
  through?: string; // Intermediate entity for many-to-many relationships
};

//////////////////////////////////////////
//  ./entities/endpoints.ts

/**
 * Entity endpoint types
 */
export type SchemaType = {
  type?: string;
  format?: string;
  properties?: Record<string, SchemaType>;
  items?: SchemaType;
  required?: string[];
  enum?: string[];
  $ref?: string;
  additionalProperties?: boolean | SchemaType;
  oneOf?: SchemaType[];
  anyOf?: SchemaType[];
  allOf?: SchemaType[];
  not?: SchemaType;
  nullable?: boolean;
};

export type EndpointMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type EntityEndpointRequestBodyContent = {
  [mimeType: string]: EntityEndpointContentSchemaType;
};

export type EntityEndpointRequestBody = {
  description?: string;
  required?: boolean;
  content: EntityEndpointRequestBodyContent;
};

type EntityEndpointResponseContentType = {
  [mimeType: string]: EntityEndpointContentSchemaType;
};

export type EntityEndpointResponseItem = {
  description: string;
  content?: EntityEndpointResponseContentType;
};

type EntityEndpointResponsesType = Record<string, EntityEndpointResponseItem>;

export type EntityEndpointSecurity = Array<{ [securityScheme: string]: string[] }>;

export type EntityEndpoint = {
  path: string;
  method: EndpointMethod;
  description?: string;
  operationId?: string;
  parameters?: EndpointParameter[];
  requestBody?: EntityEndpointRequestBody;
  responses?: EntityEndpointResponsesType;
  security?: EntityEndpointSecurity;
  tags?: string[];
};

export type EndpointParameter = {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  schema: SchemaType;
};

type EndpointExampleResponseType = {
  status: number;
  body?: unknown;
};

export type EndpointExample = {
  name: string;
  request?: unknown;
  response: EndpointExampleResponseType;
};

//////////////////////////////////////////
//  ./entities/entity.ts

/**
 * Base entity type that all entities extend
 */
export type ApiEntity = {
  id?: string;
  name: string;
  description?: string;
  attributes: EntityAttribute[];
  relationships?: EntityRelationship[];
  endpoints?: EntityEndpoint[];
};

//////////////////////////////////////////
//  ./entities/attributes.ts

/**
 * Entity attribute types
 */
export type AttributeType = 
  | 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'timestamp' | 'uuid'
  | 'object' | 'array' | 'reference' | 'enum';

type NumericValidationType = {
  min?: number;
  max?: number;
};

type StringValidationType = {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
};

type AttributeValidationType = NumericValidationType & StringValidationType;

export type EntityAttribute = {
  id: string;
  name: string;
  type: AttributeType;
  required?: boolean;
  unique?: boolean;
  default?: string | number | boolean | Date | object | unknown[];
  description?: string;
  enumValues?: string[];
  values?: string[]; // Alias for enumValues for backward compatibility
  items?: Omit<EntityAttribute, 'items'>; // For array types, this is the type of the items in the array
  validation?: AttributeValidationType;
};

export type AttributeStatus = string; // Simplified since ModelStatus wasn't available
