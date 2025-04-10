/**
 * Entity attribute types
 */
export type AttributeType = 
  | 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'timestamp' | 'uuid'
  | 'object' | 'array' | 'reference' | 'enum';

export type EntityAttribute = {
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

export type AttributeStatus = 'pristine' | 'modified' | 'deleted' | 'new';

import { History } from '../../utils/History';

export class AttributeModel {
  id: string;
  private history: History<EntityAttribute>;
  original?: EntityAttribute;
  status: AttributeStatus;

  constructor(attribute: EntityAttribute, status: AttributeStatus = 'pristine') {
    this.id = crypto.randomUUID();
    this.history = new History({...attribute});
    this.status = status;
    if (status === 'pristine') {
      this.original = {...attribute};
    }
  }

  get current(): EntityAttribute {
    const current = this.history.current;
    if (current === null) {
      throw new Error('Attribute cannot be null');
    }
    return current;
  }

  update(newValues: Partial<EntityAttribute>): void {
    this.history.update(newValues);
    this.status = 'modified';
  }

  delete(): void {
    this.status = 'deleted';
  }

  restore(): void {
    this.status = this.original ? 'pristine' : 'new';
  }

  get canUndo(): boolean {
    return this.history.canUndo;
  }

  get canRedo(): boolean {
    return this.history.canRedo;
  }

  undo(): boolean {
    const result = this.history.undo();
    if (result) {
      return true;
    }
    return false;
  }

  redo(): boolean {
    const result = this.history.redo();
    if (result) {
      return true;
    }
    return false;
  }
}
