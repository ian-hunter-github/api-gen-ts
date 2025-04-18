# TypeScript Type Reference

This document lists all TypeScript types defined in `all.types.ts`.

| Type Name | Source File | Description | Definition |
|-----------|-------------|-------------|------------|
| ApiConfig | ./api.types.ts | Main API configuration type | `{ id: string; name: string; description: string; isDemo?: boolean; ... }` |
| ApiConfigCollection | ./api.types.ts | Collection of API configs | `Record<string, ApiConfig>` |
| ApiComponents | ./components.ts | API component schemas | `{ schemas: Record<string, { type: string; properties: Record<string, unknown>; required?: string[] }> }` |
| VCSProvider | ./version-control.ts | Version control providers | `'github', 'gitlab', 'bitbucket', 'azure-repos'` |
| VCSConfig | ./version-control.ts | Version control configuration | `{ provider: VCSProvider; config: { repo: string; branch: string; accessToken: string; webhookSecret?: string } }` |
| DatabaseCommon | ./datasource.ts | Common database configuration | `{ host: string; port: number; username: string; password: string; database: string; pool?: { min?: number; max?: number } }` |
| PostgresConfig | ./datasource.ts | PostgreSQL configuration | `DatabaseCommon & { ssl?: boolean }` |
| MySQLConfig | ./datasource.ts | MySQL configuration | `DatabaseCommon & { replicaSet?: string }` |
| MongoDBConfig | ./datasource.ts | MongoDB configuration | `DatabaseCommon & { tls?: boolean }` |
| SQLiteConfig | ./datasource.ts | SQLite configuration | `{ filename: string }` |
| SupabaseConfig | ./datasource.ts | Supabase configuration | `{ url: string; anonKey: string; serviceRoleKey?: string; schema?: string; storage?: { bucket: string; public?: boolean } }` |
| FirebaseConfig | ./datasource.ts | Firebase configuration | `{ projectId: string; apiKey: string; authDomain?: string; storageBucket?: string; messagingSenderId?: string; appId?: string }` |
| FirestoreConfig | ./datasource.ts | Firestore configuration | `{ databaseURL: string; serviceAccount?: Record<string, unknown> }` |
| APIConfig | ./datasource.ts | REST/GraphQL API configuration | `{ baseUrl: string; auth?: { type: 'basic' | 'bearer' | 'apiKey'; credentials: string } }` |
| GraphQLConfig | ./datasource.ts | GraphQL configuration | `APIConfig & { schemaFile?: string }` |
| DataSourceType | ./datasource.ts | Data source types | `'postgres', 'mysql', 'mongodb', 'rest', 'graphql', 'supabase', 'firebase', 'firestore', 'dynamodb', 'redis', 'sqlite', 'cosmosdb'` |
| DataSource | ./datasource.ts | Data source configuration | `{ name: string; type: DataSourceType; config: PostgresConfig | MySQLConfig | ...; entities?: string[] }` |
| ApiSecurity | ./security.ts | API security configuration | `{ authentication: { type: 'none' | 'basic' | 'jwt' | 'oauth2' | 'api-key'; ... }; authorization?: { roles?: Array<{ name: string; ... }>; ... }; cors?: { enabled?: boolean; ... } }` |
| DeploymentProvider | ./deployment.ts | Deployment providers | `'aws', 'azure', 'gcp', 'netlify', 'vercel', 'firebase-hosting', 'heroku', 'digitalocean', 'cloudflare', 'render', 'fly.io', 'railway', 'deno-deploy', 'stormkit', 'edgio', 'layer0', 'amplify', 'cloud-run', 'app-engine', 'functions', 'cloud-functions', 'lambda', 'ecs', 'eks', 'fargate', 'app-service', 'container-instances', 'static-web-apps', 'cloudflare-workers', 'cloudflare-pages', 'netlify-functions', 'vercel-edge'` |
| DeploymentConfig | ./deployment.ts | Deployment configuration | `{ provider: DeploymentProvider; settings: { region: string; ... } | { siteName: string; ... } | Record<string, unknown> }` |
| RelationshipType | ./entities/relationships.ts | Entity relationship types | `'one-to-one', 'one-to-many', 'many-to-one', 'many-to-many'` |
| EntityRelationship | ./entities/relationships.ts | Entity relationship | `{ name: string; type: RelationshipType; source: string; target: string; description?: string; ... }` |
| SchemaType | ./entities/endpoints.ts | Schema definition type | `{ type?: string; format?: string; properties?: Record<string, SchemaType>; items?: SchemaType; ... }` |
| EndpointMethod | ./entities/endpoints.ts | HTTP methods | `'GET', 'POST', 'PUT', 'PATCH', 'DELETE'` |
| EntityEndpoint | ./entities/endpoints.ts | Entity endpoint | `{ path: string; method: EndpointMethod; description?: string; parameters?: EndpointParameter[]; ... }` |
| EndpointParameter | ./entities/endpoints.ts | Endpoint parameter | `{ name: string; in: 'query' | 'header' | 'path' | 'cookie'; description?: string; required?: boolean; schema: SchemaType }` |
| EndpointExample | ./entities/endpoints.ts | Endpoint example | `{ name: string; request?: unknown; response: { status: number; body?: unknown } }` |
| ApiEntity | ./entities/entity.ts | Base entity type | `{ id?: string; name: string; description?: string; attributes: EntityAttribute[]; relationships?: EntityRelationship[]; endpoints?: EntityEndpoint[] }` |
| AttributeType | ./entities/attributes.ts | Attribute types | `'string', 'number', 'boolean', 'date', 'datetime', 'timestamp', 'uuid', 'object', 'array', 'reference', 'enum'` |
| EntityAttribute | ./entities/attributes.ts | Entity attribute | `{ id: string; name: string; type: AttributeType; required?: boolean; unique?: boolean; default?: string | number | boolean | Date | object | unknown[]; ... }` |
| AttributeStatus | ./entities/attributes.ts | Attribute status | Alias for ModelStatus |
