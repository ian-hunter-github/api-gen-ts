import { ApiSecurity } from './security';
import { ApiComponents } from './components';
import { DataSource } from './datasource';
import { DeploymentConfig } from './deployment';
import { CICDConfig } from './cicd';
import { VCSConfig } from './version-control';
import { ApiEntity } from './entities/entity';

/**
 * Main API configuration type
 */
export type ApiConfig = {
  id: string;
  name: string;
  description?: string;
  isDemo?: boolean;
  version: string;
  entities: ApiEntity[];
  security: ApiSecurity;
  components?: ApiComponents;
  dataSources?: DataSource[];
  deployments?: DeploymentConfig[];
  ciCd?: CICDConfig[];
  versionControl?: VCSConfig;
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
  createdAt?: string;
  updatedAt?: string;
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
    typeof (config as Record<string, unknown>).id === 'string' &&
    typeof (config as Record<string, unknown>).name === 'string' && 
    typeof (config as Record<string, unknown>).version === 'string' &&
    Array.isArray((config as Record<string, unknown>).entities) &&
    typeof (config as Record<string, unknown>).security === 'object'
  );
}
