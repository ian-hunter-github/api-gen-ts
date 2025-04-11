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

  get current(): EntityAttribute | null {
    return this.history.current;
  }

  get previous(): EntityAttribute | null {
    return this.history.previous;
  }

  update(newValues: Partial<EntityAttribute>): void {
    this.history.update(newValues);
    this.status = 'modified';
  }

  delete(): void {
    this.history.updateDeleted();
    this.status = 'deleted';
  }

  restore(): void {
    this.status = this.original ? 'pristine' : 'new';
    // When restoring, we need to ensure the history reflects the restored state
    if (this.history.current === null) {
      this.history.undo(); // Go back to pre-delete state
    }
  }

  get canUndo(): boolean {
    return this.history.canUndo;
  }

  get canRedo(): boolean {
    return this.history.canRedo;
  }

  undo(): boolean {
    const result = this.history.undo();
    if (result !== null) {
      this.status = result === null ? 'deleted' : 
                   this.original && JSON.stringify(result) === JSON.stringify(this.original) ? 
                   'pristine' : 'modified';
      return true;
    }
    return false;
  }

  redo(): boolean {
    const result = this.history.redo();
    if (result !== null || this.history.current === null) {
      this.status = this.history.current === null ? 'deleted' : 'modified';
      return true;
    }
    return false;
  }
}
