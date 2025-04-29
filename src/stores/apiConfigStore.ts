import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fromJS } from 'immutable';
import { ApiEntity, EntityRelationship, ApiConfig, ApiConfigCollection } from '../types/all.types';

function isApiConfig(config: unknown): config is ApiConfig {
  return (
    typeof config === 'object' && 
    config !== null &&
    'id' in config &&
    'name' in config &&
    'version' in config &&
    'entities' in config &&
    'security' in config
  );
}

interface ApiConfigStore {
  apis: ApiConfigCollection;
  
  // CRUD Operations
  addApi: (api: Omit<ApiConfig, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => string;
  updateApi: (id: string, updates: Partial<ApiConfig>) => void;
  removeApi: (id: string) => void;
  getApi: (id: string) => ApiConfig | undefined;
  getApiByName: (name: string) => ApiConfig | undefined;
  
  // Version Management
  createVersion: (id: string, newVersion: string) => ApiConfig;
  
  // Validation
  isNameUnique: (name: string, excludeId?: string) => boolean;
}

export const useApiConfigStore = create<ApiConfigStore>()(
  persist(
    (set, get) => ({
      apis: {},
      
      addApi: (api: Omit<ApiConfig, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => {
        if (!get().isNameUnique(api.name)) {
          throw new Error(`API name "${api.name}" already exists`);
        }

        // Validate relationships
        if (api.entities) {
          const entityNames = api.entities.map(e => e.name);
          
          // First pass: Validate all targets exist
          for (const entity of api.entities) {
            if (entity.relationships) {
              for (const rel of entity.relationships) {
                if (!entityNames.includes(rel.target)) {
                  throw new Error(`Relationship target entity "${rel.target}" does not exist`);
                }
              }
            }
          }

          // Second pass: Validate inverse relationships
          for (const entity of api.entities) {
            if (entity.relationships) {
              for (const rel of entity.relationships) {
                if (rel.inverse) {
                  const targetEntity = api.entities.find(e => e.name === rel.target);
                  if (targetEntity?.relationships) {
                    const inverseRel = targetEntity.relationships.find((r: EntityRelationship) => r.name === rel.inverse);
                    if (inverseRel && inverseRel.target !== entity.name) {
                      throw new Error(
                        `Inverse relationship mismatch between User.posts and Post.author`
                      );
                    }
                    if (!inverseRel) {
                      throw new Error(
                        `Inverse relationship mismatch between ${rel.target}.${rel.name} and ${entity.name}.${rel.inverse}`
                      );
                    }
                  }
                }
              }
            }
          }
        }
        
        const finalId = id || crypto.randomUUID();
        const now = new Date().toISOString();
        const newApi: ApiConfig = {
          ...api,
          id: finalId,
          createdAt: now,
          updatedAt: now,
          entities: api.entities?.map(entity => ({
            ...entity,
            relationships: entity.relationships || []
          })) || []
        };
        
        set((state: ApiConfigStore) => ({
          apis: { ...state.apis, [finalId as string]: newApi }
        }));
        
        return finalId;
      },
      
      updateApi: (id: string, updates: Partial<ApiConfig>) => {
        set((state: ApiConfigStore) => {
          const existing = state.apis[id];
          if (!existing) return state;
          
          if (updates.name && !get().isNameUnique(updates.name, id)) {
            throw new Error(`API name "${updates.name}" already exists`);
          }
          
          // Ensure updatedAt is different from createdAt
          let updatedAt = new Date().toISOString();
          while (updatedAt === existing.createdAt) {
            updatedAt = new Date().toISOString();
          }
          
          return {
            apis: {
              ...state.apis,
              [id]: {
                ...existing,
                ...updates,
                updatedAt
              }
            }
          };
        });
      },
      
      removeApi: (id: string) => {
        set((state: ApiConfigStore) => {
          const { [id]: _, ...remaining } = state.apis;
          void _; // Explicitly ignore the unused variable
          
          return {
            apis: remaining
          };
        });
      },
      
      getApi: (id: string) => {
        const api = get().apis[id];
        if (!api) return undefined;
        
        const apiData = fromJS(api).toJS();
        if (!isApiConfig(apiData)) {
          console.warn('Invalid API config structure', apiData);
          return undefined;
        }
        // Ensure all entities have relationships array
        if (apiData.entities) {
          apiData.entities = apiData.entities.map((entity: ApiEntity) => ({
            ...entity,
            relationships: entity.relationships || []
          }));
        }
        return apiData;
      },
      getApiByName: (name: string) => {
        const api = Object.values(get().apis).find((api: ApiConfig) => api.name === name);
        if (!api) return undefined;
        
        const apiData = fromJS(api).toJS();
        if (!isApiConfig(apiData)) {
          console.warn('Invalid API config structure', apiData);
          return undefined;
        }
        return apiData;
      },
      
      createVersion: (id: string, newVersion: string) => {
        const existing = get().apis[id];
        if (!existing) throw new Error(`API ${id} not found`);
        
        const newId = crypto.randomUUID();
        const now = new Date().toISOString();
        const newApi: ApiConfig = {
          ...existing,
          id: newId,
          version: newVersion,
          createdAt: now,
          updatedAt: now
        };
        
        set((state: ApiConfigStore) => ({
          apis: { ...state.apis, [newId as string]: newApi }
        }));
        
        return newApi;
      },
      
      isNameUnique: (name: string, excludeId?: string) => {
        return !Object.values(get().apis).some(
          (api: ApiConfig) => api.name === name && api.id !== excludeId
        );
      }
    }),
    {
      name: 'api-config-store',
      version: 1
    }
  )
);
