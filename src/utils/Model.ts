import { History } from './History';

export type ModelStatus = 'pristine' | 'modified' | 'deleted' | 'new';

export class Model<T> {
  id: string;
  history: History<T>;
  original?: T;
  status: ModelStatus;

  constructor(data: T, status: ModelStatus = 'pristine') {
    this.id = crypto.randomUUID();
    this.history = new History({...data});
    this.status = status;
    if (status === 'pristine') {
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
    this.status = 'modified';
  }

  delete(): void {
    this.history.updateDeleted();
    this.status = 'deleted';
  }

  restore(): void {
    this.status = this.original ? 'pristine' : 'new';
    if (this.history.current === null) {
      this.history.undo();
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
      this.status = 'deleted';
    } else {
      this.status = this.original && JSON.stringify(this.history.current) === JSON.stringify(this.original) ? 
                   'pristine' : 'modified';
    }
    return true;
  }

  redo(): boolean {
    if (!this.history.canRedo) return false;
    
    this.history.redo();
    this.status = this.history.current === null ? 'deleted' : 'modified';
    return true;
  }
}
