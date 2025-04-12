import { History } from './History';

export type ModelStatus = 'pristine' | 'modified' | 'deleted' | 'new';

export class Model<T> {
  id: string;
  private history: History<T>;
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
