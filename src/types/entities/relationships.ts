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
