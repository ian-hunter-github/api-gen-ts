import { History } from './History';

export enum ModelStatus {
  Pristine = 'pristine',
  Modified = 'modified',
  Deleted = 'deleted',
  New = 'new'
}

export const MODEL_STATUSES = Object.values(ModelStatus);

export class Model<T> {
  id: string;
  history: History<T>;
  original?: T;
  status: ModelStatus;

  constructor(
    data: T, 
    status: ModelStatus = ModelStatus.Pristine,
    idGenerator: () => string = () => crypto.randomUUID()
  ) {
    this.id = idGenerator();
    this.history = new History({...data});
    this.status = status;
    if (status === ModelStatus.Pristine) {
      this.original = {...data};
    }
  }

  get current(): T | null {
    return this.history.current;
  }

  get previous(): T | null {
    return this.history.previous;
  }

  update(newValues: Partial<T>): void {
    this.history.update(newValues);
    this.status = ModelStatus.Modified;
  }

  delete(): void {
    console.debug('Model.delete() called on model:', this.id);
    console.debug('Current model state:', JSON.stringify({
      id: this.id,
      status: this.status,
      current: this.current,
      original: this.original
    }, null, 2));
    this.history.updateDeleted();
    this.status = ModelStatus.Deleted;
    console.debug('Model after delete:', JSON.stringify({
      id: this.id,
      status: this.status,
      current: this.current,
      original: this.original
    }, null, 2));
  }

  restore(): void {
    this.status = this.original ? ModelStatus.Pristine : ModelStatus.New;
    if (this.history.current === null) {
      this.history.undo();
    }
    // If restoring from deleted after edits, maintain modified state
    if (this.original && JSON.stringify(this.history.current) !== JSON.stringify(this.original)) {
      this.status = ModelStatus.Modified;
    }
  }

  get canUndo(): boolean {
    return this.history.canUndo;
  }

  get canRedo(): boolean {
    return this.history.canRedo;
  }

  undo(): boolean {
    if (!this.history.canUndo) return false;
    
    this.history.undo();
    
    if (this.history.current === null) {
      // Undoing to a deleted state
      this.status = ModelStatus.Deleted;
    } else {
      this.status = this.original && JSON.stringify(this.history.current) === JSON.stringify(this.original) ? 
                   ModelStatus.Pristine : ModelStatus.Modified;
    }
    return true;
  }

  redo(): boolean {
    if (!this.history.canRedo) return false;
    
    this.history.redo();
    this.status = this.history.current === null ? ModelStatus.Deleted : ModelStatus.Modified;
    return true;
  }
}
