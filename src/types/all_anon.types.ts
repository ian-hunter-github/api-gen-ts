
//////////////////////////////////////////
//  ./api.types.ts


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
  documentation?: {
    enabled: boolean;
    format: 'openapi' | 'asyncapi' | 'markdown';
  };
  entities: ApiEntity[];
  security: ApiSecurity;
  components?: ApiComponents;
  datasource?: {
    type: string;
    connection?: {
      url?: string;
      host?: string;
      port?: number;
      database?: string;
      username?: string;
      password?: string;
    };
  };
  deployment?: DeploymentConfig[];
  cicd?: {
    enabled: boolean;
    stages?: string[];
  };
  versionControl?: VCSConfig;
  createdAt: string;
  updatedAt?: string;
  endpoints?: {
    baseUrl: string;
    paths: Record<string, {
      path: string;
      method: string;
      operationId?: string;
      description?: string;
      requestBody?: {
        required?: boolean;
        content?: Record<string, {
          schema?: {
            $ref?: string;
            type?: string;
            properties?: Record<string, unknown>;
          };
        }>;
      };
      responses?: Record<string, {
        description?: string;
        content?: Record<string, {
          schema?: {
            $ref?: string;
            type?: string;
          };
        }>;
      }>;
    }>;
  };
};

export type ApiConfigCollection = Record<string, ApiConfig>;

export function isApiConfig(config: unknown): config is ApiConfig {
  return (
    typeof config === 'object' && 
    config !== null &&
    'id' in config &&
    'name' in config &&
    'version' in config &&
    'entities' in config && 
    'security' in config &&
    'description' in config &&
    'createdAt' in config &&
    typeof (config as Record<string, unknown>).id === 'string' &&
    typeof (config as Record<string, unknown>).name === 'string' && 
    typeof (config as Record<string, unknown>).version === 'string' &&
    typeof (config as Record<string, unknown>).description === 'string' &&
    typeof (config as Record<string, unknown>).createdAt === 'string' &&
    Array.isArray((config as Record<string, unknown>).entities) &&
    typeof (config as Record<string, unknown>).security === 'object'
  );
}

//////////////////////////////////////////
//  ./components.ts

/**
 * API component schemas
 */
export type ApiComponents = {
  schemas: Record<string, {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  }>;
};

//////////////////////////////////////////
//  ./version-control.ts

/**
 * Version control providers
 */
export type VCSProvider = 'github' | 'gitlab' | 'bitbucket' | 'azure-repos';

export type VCSConfig = {
  provider: VCSProvider;
  config: {
    repo: string;
    branch: string;
    accessToken: string;
    webhookSecret?: string;
  };
};

//////////////////////////////////////////
//  ./datasource.ts

/**
 * Data source configuration types
 */


/**
 * Common database configuration
 */
export type DatabaseCommon = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  pool?: { min?: number; max?: number };
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
export type SupabaseConfig = {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  schema?: string;
  storage?: {
    bucket: string;
    public?: boolean;
  };
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
export type APIConfig = {
  baseUrl: string;
  auth?: {
    type: 'basic' | 'bearer' | 'apiKey';
    credentials: string;
  };
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
    | { region: string; endpoint?: string } // DynamoDB
    | { endpoint: string; key: string } // CosmosDB
    | APIConfig
    | GraphQLConfig;
  entities?: string[];
};

//////////////////////////////////////////
//  ./security.ts

/**
 * API security configuration
 */
export type ApiSecurity = {
  authentication: {
    type: 'none' | 'basic' | 'jwt' | 'oauth2' | 'api-key';
    jwt?: {
      secret: string;
      expiresIn: string;
      issuer?: string;
      audience?: string;
      refreshToken?: {
        expiresIn: string;
      };
    };
    oauth2?: {
      authorizationUrl: string;
      tokenUrl: string;
      scopes: Record<string, string>;
    };
    apiKey?: {
      header?: string;
      queryParam?: string;
    };
  };
  authorization?: {
    roles?: Array<{
      name: string;
      description: string;
      permissions: string[];
    }>;
    policies?: Array<{
      name: string;
      description?: string;
      rules?: Array<{
        resource: string;
        action: string[];
        condition?: string;
      }>;
      effect?: 'allow' | 'deny';
      actions?: string[];
      resources?: string[];
      conditions?: Record<string, unknown>;
    }>;
  };
  cors?: {
    enabled?: boolean;
    origins?: string[];
    methods?: string[];
    headers?: string[];
  };
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
  settings: 
    | { region: string; lambdaMemory?: number; apiGateway?: boolean }
    | { siteName: string; functionsDir?: string }
    | Record<string, unknown>;
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

export type EntityEndpoint = {
  path: string;
  method: EndpointMethod;
  description?: string;
  operationId?: string;
  parameters?: EndpointParameter[];
  requestBody?: {
    description?: string;
    required?: boolean;
    content: {
      [mimeType: string]: {
        schema: SchemaType;
      };
    };
  };
  responses?: {
    [statusCode: string]: {
      description: string;
      content?: {
        [mimeType: string]: {
          schema: SchemaType;
        };
      };
    };
  };
  security?: Array<{ [securityScheme: string]: string[] }>;
  tags?: string[];
};

export type EndpointParameter = {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  schema: SchemaType;
};

export type EndpointExample = {
  name: string;
  request?: unknown;
  response: {
    status: number;
    body?: unknown;
  };
};

//////////////////////////////////////////
//  ./entities/entity.ts

export type { EntityAttribute };

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
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
};

export type AttributeStatus = ModelStatus;
