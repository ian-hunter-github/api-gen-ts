export class History<T> {
  private history: (T | null)[];
  private currentIndex: number;

  constructor(initial: T) {
    if (initial === null || initial === undefined) {
      throw new Error('History cannot be initialized with null or undefined');
    }
    this.history = [initial];
    this.currentIndex = 0;
  }

  get current(): T | null {
    return this.history[this.currentIndex];
  }

  get previous(): T | null {
    return this.currentIndex > 0 ? this.history[this.currentIndex - 1] : null;
  }

  get canUndo(): boolean {
    return this.currentIndex > 0;
  }

  get canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  update(partial: Partial<T>): void {
    if (partial === null || partial === undefined) {
      throw new Error('Use updateDeleted() for null updates');
    }

    // Create new state by merging changes
    const newState = this.current ? {
      ...this.current,
      ...partial
    } : partial as T;

    // Skip if new state is same as current
    if (JSON.stringify(newState) === JSON.stringify(this.current)) {
      return;
    }

    // If not at end of history, truncate future states
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    this.history.push(newState);
    this.currentIndex++;
  }

  updateDeleted(): void {
    // Skip if already deleted
    if (this.current === null) {
      return;
    }

    // If not at end of history, truncate future states
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    this.history.push(null);
    this.currentIndex++;
  }

  undo(): T | null {
    if (!this.canUndo) return null;
    this.currentIndex--;
    return this.current;
  }

  redo(): T | null {
    if (!this.canRedo) return null;
    this.currentIndex++;
    return this.current;
  }

  get historyLength(): number {
    return this.history.length;
  }
}
