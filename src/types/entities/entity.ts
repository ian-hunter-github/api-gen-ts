import { EntityAttribute } from './attributes';
import { EntityRelationship } from './relationships';
import { EntityEndpoint } from './endpoints';

/**
 * Base entity type that all entities extend
 */
export type ApiEntity = {
  name: string;
  description?: string;
  attributes: EntityAttribute[];
  relationships?: EntityRelationship[];
  endpoints?: EntityEndpoint[];
};
