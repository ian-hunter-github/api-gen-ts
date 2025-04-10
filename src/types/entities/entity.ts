import type { EntityAttribute } from './attributes';
export type { EntityAttribute };
import { EntityRelationship } from './relationships';
import { EntityEndpoint } from './endpoints';

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
