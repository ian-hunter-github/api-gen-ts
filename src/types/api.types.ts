import { ApiSecurity } from './security';
import { ApiComponents } from './components';
import { DeploymentConfig } from './deployment';
import { VCSConfig } from './version-control';
import { ApiEntity } from './entities/entity';

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
