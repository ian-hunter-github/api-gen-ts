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
